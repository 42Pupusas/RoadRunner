use base64::{engine::general_purpose, Engine};
use futures_util::{SinkExt, StreamExt};
use lightning_invoice::Invoice;
use serde::{Deserialize, Serialize};
use serde_json::{json, from_str, Value};
use tokio_tungstenite::{connect_async, tungstenite::Message};

use crate::{lnd::get_htlc_invoice, models::{secrets::RELAY_URL, nostr::{NostrSubscription, SignedNote, Note}, server::ServerBot}};


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

    fn get_invoice(&self) -> &str {
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

    pub fn get_invoice_base64(&self) -> Result<String, &str> {
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

    pub fn get_nostr_note(&self, status: String) -> Note {
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
        let url = url::Url::parse(RELAY_URL).unwrap();

        // Connect to the server
        let (ws_stream, _) = connect_async(url).await.expect("Failed to connect");
        println!("Connected to the server");

        // Split the WebSocket into a sender and receiver half
        let (mut write, mut read) = ws_stream.split();

        // Create prompt filters
        let prompt_filters = json!({ "ids": [id] });

        write
            .send(NostrSubscription::new(prompt_filters))
            .await
            .expect("Failed to send JSON");

        match read.next().await {
            Some(message) => match message {
                Ok(Message::Text(message)) => {
                    if let Ok((_type, _id, note)) = from_str::<(String, String, Value)>(&message) {
                        let nostr_note = SignedNote::read_new(note).unwrap_or_else(|e| {
                            println!("Error reading note: {:?}", e);
                            panic!();
                        });
                        println!("Found nostr contract: {}", nostr_note.content);
                        match from_str::<PassengerRequest>(&nostr_note.content) {
                            Ok(passenger_note) => {
                                return  RideContract::new(
                                    nostr_note.tags[0][1].clone(),
                                    nostr_note.tags[1][1].clone(),
                                    nostr_note.tags[2][1].clone(),
                                    passenger_note.invoice,
                                    Some(passenger_note.htlc),
                                    Some(nostr_note.id.clone()),
                                );
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

}
