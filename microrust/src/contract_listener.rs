use serde_json::{from_str, json};
use tokio_tungstenite::tungstenite::Message;
use utils::{models::nostr::{SignedNote, NostrRelay}, roadrunner::RideContract};


#[tokio::main]
async fn main() {

    let mut nostr_ws = NostrRelay::new().await;

    // Create prompt filters and send them to the server
    let prompt_filters = json!({ "kinds": [20020]});
    nostr_ws.subscribe(prompt_filters).await.expect("Failed to subscribe");


    loop {
        match nostr_ws.read_notes().await {
            Some(message) => match message {
                Ok(Message::Text(message)) => {
                    if let Ok((_type, _id, note)) = 
                        from_str::<(String, String, SignedNote)>(&message) {

                            let retrieved_contract = 
                                RideContract::find_contract(note.content).await;

                            tokio::spawn(async move {
                                match retrieved_contract.handle_ride_payments().await {
                                    Ok(()) => {
                                        println!("Starting to listen");
                                    },
                                    Err(e) => {
                                        println!("Error connecting to LND {:?}", e);
                                    }
                                } 
                            });
                        }

                    // ERROR AND NOTICE HANDLERS
                    else if let Ok((notice, id)) = from_str::<(String, String)>(&message) {
                        println!("Received notice: {} {}", notice, id);

                    }
                    else  {
                        println!("Received relay message");
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
            }
        }
    }
}
