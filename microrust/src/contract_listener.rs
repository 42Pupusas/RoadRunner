use async_recursion::async_recursion;
use futures_util::{SinkExt, StreamExt};
use serde_json::{from_str, json, Value};
use tokio_tungstenite::{connect_async, tungstenite::Message};
use utils::{models::{
    nostr::{NostrSubscription, SignedNote},
    secrets::RELAY_URL,
    server::ServerBot,
}, roadrunner::RideContract};

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
        "kinds": [20020]
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

                        println!("Passenger wants to prepay {:?}", nostr_note);

                        let retrieved_contract = RideContract::find_contract(nostr_note.content).await;

                        println!("Retrieved contract: {:?}", retrieved_contract);

                        // IF we find a contract, start listening for the prepayment


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
