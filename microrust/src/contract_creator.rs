use async_recursion::async_recursion;
use futures_util::{SinkExt, StreamExt};
use serde_json::{from_str, json, Value};
use tokio_tungstenite::{connect_async, tungstenite::Message};
use utils::{models::{
    nostr::{NostrSubscription, SignedNote},
    secrets::RELAY_URL,
    server::ServerBot,
}, roadrunner::{DriverOffer, RideContract}};

#[tokio::main]
async fn main() {
    connect_and_reconnect().await;
}

#[async_recursion]
async fn connect_and_reconnect() {
    // Parse URL address into URL struct
    let url = url::Url::parse(RELAY_URL).unwrap();

    // Connect to the server
    let (ws_stream, _) = connect_async(url).await.expect("Failed to connect");
    println!("Connected to the server");

    // Split the WebSocket into a sender and receiver half
    let (mut write, mut read) = ws_stream.split();

    // Create prompt filters
    let prompt_filters = json!({
        "kinds": [20010]
    });

    write
        .send(NostrSubscription::new(prompt_filters))
        .await
        .expect("Failed to send JSON");

    loop {
        match read.next().await {
            Some(message) => match message {
                Ok(Message::Text(message)) => {
                    if let Ok((_type, _id, note)) = from_str::<(String, String, Value)>(&message) {
                        let nostr_note = SignedNote::read_new(note).unwrap_or_else(|e| {
                            println!("Error reading note: {:?}", e);
                            panic!();
                        });

                        match from_str::<DriverOffer>(&nostr_note.content) {
                            Ok(driver_offer) => {
                                let mut ride_contract = RideContract::new(
                                    nostr_note.tags[0][1].clone(),
                                    driver_offer.passenger,
                                    nostr_note.pubkey,
                                    driver_offer.invoice,
                                    None,
                                    None,
                                );

                                match ride_contract.create_htlc().await {
                                    Ok(()) => {
                                        let contract_note = ride_contract.get_nostr_note("offered".to_string());
                                        // println!("Unsigned note: {:?}", contract_note);
                                        let contract_note =
                                            ServerBot::new().sign_nostr_event(contract_note);
                                        println!("Siigned note: {:?}", contract_note);
                                        write
                                            .send(contract_note.prepare_ws_message())
                                            .await
                                            .expect("Failed to send JSON");
                                    }
                                    _ => {
                                        println!("Error creating HTLC");
                                    }
                                }
                            }
                            Err(e) => {
                                println!("Error getting invoice: {:?}", e);
                            }
                        }
                    } else {
                        println!("Received relay message: {}", message);
                    }
                }

                Ok(_) => {
                    println!("Received non-text message");
                }
                Err(e) => {
                    println!("Error receiving message: {:?}", e);
                }
            },
            None => {
                println!("Connection closed");
                connect_and_reconnect().await;
                break;
            }
        }
    }
}
