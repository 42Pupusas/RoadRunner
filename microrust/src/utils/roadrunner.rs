use base64::{engine::general_purpose, Engine};
use lightning_invoice::Invoice;
use serde::{Deserialize, Serialize};
use serde_json::{json, from_str};
use tokio_tungstenite::tungstenite::Message;

use tokio::sync::mpsc;
use crate::{lnd::{get_htlc_invoice, LndWebSocket}, models::{
    nostr::{SignedNote, Note, NostrRelay}, 
    server::ServerBot, 
    lightning::HTLCStreamResult}};

#[derive(Serialize, Deserialize)]
pub struct DriverOffer {
    pub invoice: String,
    pub htlc: Option<String>,
    pub passenger: String,
}

#[derive(Serialize, Deserialize)]
pub struct PassengerRequest{
    pub invoice: String,
    pub htlc: String,
    pub status: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct RideContract {
    ride: String,
    passenger: String,
    driver: String,

    invoice: String,
    htlc: Option<String>,
    id: Option<String>,
}

impl RideContract {
    pub fn new(
        ride: String,
        passenger: String,
        driver: String,
        invoice: String,
        htlc: Option<String>,
        id: Option<String>,
        ) -> Self {
        RideContract {
            ride,
            passenger,
            driver,
            invoice,
            htlc,
            id,
        }
    }

    pub fn get_invoice(&self) -> &str {
        &self.invoice
    }

    fn get_invoice_sat_amount(&self) -> Result<u64, &str> {
        match str::parse::<Invoice>(self.get_invoice()) {
            Ok(invoice) => match invoice.amount_milli_satoshis() {
                Some(amount) => Ok(amount / 1000),
                _ => Err("Error getting Invoice Amount"),
            },
            Err(e) => {
                println!("Error getting invoice: {:?}", e);
                Err("Error getting Invoice Amount")
            }
        }
    }

    fn get_invoice_base64(&self) -> Result<String, &str> {
        match str::parse::<Invoice>(self.get_invoice()) {
            Ok(invoice) => {
                let r_hash_safe = general_purpose::URL_SAFE.encode(invoice.signable_hash());
                Ok(r_hash_safe)
            }
            Err(_e) => Err("Error getting Invoice Amount"),
        }
    }

    pub async fn create_htlc(&mut self) -> Result<(), &str> {
        if let Ok(invoice_amount) = self.get_invoice_sat_amount() {
            if let Ok(invoice_base64) = self.get_invoice_base64() {
                match get_htlc_invoice(invoice_amount + 420, invoice_base64, 21000).await {
                    Ok(htlc) => {
                        self.htlc = Some(htlc.payment_request);
                        Ok(())
                    }
                    Err(_e) => Err("Error getting HTLC"),
                }
            } else {
                Err("Error getting Invoice Base64")
            }
        } else {
            Err("Error getting Invoice Amount")
        }
    }

    pub fn get_nostr_note(&self, status: &str) -> Note {
        let offer_object = json!({
            "htlc": self.htlc.as_ref(),
            "invoice": self.invoice,
            "status": status,
        });

        let nostr_note = Note::new(
            ServerBot::new().get_public_key(),
            vec![
            vec!['p'.to_string(), self.passenger.clone()],
            vec!['e'.to_string(), self.ride.clone()],
            vec!['p'.to_string(), self.driver.clone()],
            ],
            4200 as u32,
            offer_object.to_string(),
            );

        nostr_note
    }

    pub async fn find_contract(id: String) -> Self {
        let mut contract_ws = NostrRelay::new().await;
        let prompt_filters = json!({ "ids": [id] });
        contract_ws.subscribe(prompt_filters).await.expect("Failed to subscribe");
        match contract_ws.read_notes().await {
            Some(message) => match message {
                Ok(Message::Text(message)) => {
                    if let Ok((_type, _id, note)) = from_str::<(String, String, SignedNote)>(&message) {
                        println!("Found nostr contract: {}", note.id);
                        match from_str::<PassengerRequest>(&note.content) {
                            Ok(passenger_note) => {
                                match contract_ws.close().await {

                                    Ok(_) => {
                                        println!("Closed contract websocket");
                                        return  RideContract::new(
                                            note.tags[0][1].clone(),
                                            note.tags[1][1].clone(),
                                            note.tags[2][1].clone(),
                                            passenger_note.invoice,
                                            Some(passenger_note.htlc),
                                            Some(note.id.clone()),
                                            );
                                    }
                                    Err(_e) => {
                                        println!("Error closing websocket");
                                        panic!();
                                    }
                                }

                            }
                            Err(_e) => {
                                println!("Error reading Driver Offer");
                                panic!();
                            }
                        }
                    } else {
                        println!("Error reading message");
                        panic!();
                    }
                }
                _ => {
                    println!("Error reading message");
                    panic!();
                }
            },
            _ => {
                println!("Error reading message");
                panic!();
            }
        }
    }


    pub async fn handle_ride_payments(&self) -> Result<(), Box<dyn std::error::Error>> {
        let mut peers_ws = NostrRelay::new().await;

        // Create prompt filters
        let prompt_filters = json!({ "kinds": [20021, 20022, 20023] });
        peers_ws.subscribe(prompt_filters).await.expect("Failed to subscribe");

        let base64 = self.get_invoice_base64().unwrap();
        println!("hash base64: {}", base64);
        let (tx, mut rx) = mpsc::channel::<String>(10);
        let mut contract_ws = LndWebSocket::new(self.get_invoice_base64().unwrap()).await;

        let tx_clone = tx.clone();

        tokio::spawn(async move {
            loop {
                match contract_ws.read_invoice_states().await {
                    Some(Ok(Message::Text(result))) => {
                        match from_str::<HTLCStreamResult>(&result) {
                            Ok(htlc_result) => {
                                println!("Invoice State is {:?}", htlc_result.result.state);
                            }
                            Err(e) => {
                                println!("Error reading invoice result: {:?}", e);
                            }
                        }
                    }
                    Some(Ok(e)) => {
                        println!("LND is Waiting for payment, {:?}", e);
                    }
                    Some(Err(e)) => {
                        println!("Error with LND stream: {:?}", e);
                        panic!();
                    }
                    None => {
                        println!("Error reading invoice states");
                        panic!();
                    }
                }

                if let Ok(msg) = rx.try_recv() {
                    if msg == "close" {
                        if let Err(e) = contract_ws.close().await {
                            println!("Error closing websocket: {:?}", e);
                            panic!();
                        }
                    } else if msg == "done" {
                        println!("Exiting from receiver loop");
                        break;
                    }
                }

                tokio::task::yield_now().await;
            }
        });

        tokio::spawn(async move {
            loop {
                match peers_ws.read_notes().await {
                    Some(Ok(Message::Text(message))) => {
                        if let Ok((_type, _id, note)) = from_str::<(String, String, SignedNote)>(&message) {
                            if note.kind == 20021 {
                                println!("Peer contacted us with kind: {}", note.kind);
                                peers_ws.close().await.unwrap_or_else(|e| {
                                    println!("Error peers websocket: {:?}", e);
                                    panic!();
                                });
                                println!("Closed peering websocket");
                                if let Err(e) = tx_clone.try_send("close".to_string()) {
                                    match e {
                                        tokio::sync::mpsc::error::TrySendError::Closed(_) => {
                                            println!("Channel is closed. Skipping message: {:?}", e);
                                        }
                                        tokio::sync::mpsc::error::TrySendError::Full(_) => {
                                            println!("Channel is full. Skipping message: {:?}", e);
                                        }
                                    }
                                }
                                if let Err(e) = tx_clone.try_send("done".to_string()) {
                                    match e {
                                        tokio::sync::mpsc::error::TrySendError::Closed(_) => {
                                            println!("Channel is closed. Skipping message: {:?}", e);
                                        }
                                        tokio::sync::mpsc::error::TrySendError::Full(_) => {
                                            println!("Channel is full. Skipping message: {:?}", e);
                                        }
                                    }
                                }
                                break;
                            }
                        } else if let Ok((notice, id)) = from_str::<(String, String)>(&message) {
                            println!("Relay notice {} for {}", notice, id);
                        }
                    }
                    Some(Ok(_)) => {
                        println!("Error reading message");
                        panic!();
                    }

                    Some(Err(_)) => {
                        println!("Error reading message");
                        panic!();
                    }
                    None => {
                        println!("Error reading message");
                        panic!();
                    }
                }

                tokio::task::yield_now().await;
            }
        });

        Ok(())
    }
}
