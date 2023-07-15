use rand::{thread_rng, Rng};
use secp256k1::SecretKey;
use serde::{Deserialize, Serialize};
use serde_json::{json, to_value, Value};
use std::time::{SystemTime, UNIX_EPOCH};
use tokio_tungstenite::tungstenite::protocol::Message as WsMessage;

#[derive(Serialize, Deserialize)]
pub struct NostrSubscription {
    id: String,
    filters: Value,
}

impl NostrSubscription {
    pub fn new(filter: Value) -> WsMessage {
        let id = hex::encode(&new_keys()[..]);
        let nostr_subscription = NostrSubscription {
            id,
            filters: filter,
        };
        let nostr_subscription_string = WsMessage::Text(
            json!(["REQ", nostr_subscription.id, nostr_subscription.filters]).to_string(),
        );
        nostr_subscription_string
    }
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Note {
    pub pubkey: String,
    pub created_at: u64,
    pub kind: u32,
    pub tags: Vec<Vec<String>>,
    pub content: String,
}

impl Note {
    pub fn new(pubkey: String, tags: Vec<Vec<String>>, kind: u32, content: String) -> Self {
        Note {
            pubkey,
            created_at: get_unix_timestamp(),
            kind,
            tags,
            content,
        }
    }
    pub fn serialize_for_nostr(&self) -> String {
        let value = to_value(self).unwrap();

        let json_str = json!([
            0,
            value["pubkey"],
            value["created_at"],
            value["kind"],
            value["tags"],
            value["content"]
        ]);
        json_str.to_string()
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SignedNote {
    pub id: String,
    pub pubkey: String,
    pub created_at: u64,
    pub kind: u32,
    pub tags: Vec<Vec<String>>,
    pub content: String,
    pub sig: String,
}

impl SignedNote {
    pub fn read_new(json: Value) -> Result<SignedNote, String> {
        match serde_json::from_value::<SignedNote>(json) {
            Ok(note) => Ok(note),
            Err(_e) => Err("Failed to parse Note".to_string()),
        }
    }

    pub fn prepare_ws_message(&self) -> WsMessage {
        let event_string = json!(["EVENT", self]).to_string();
        let event_ws_message = WsMessage::Text(event_string);
        event_ws_message
    }
}

pub fn new_keys() -> SecretKey {
    let mut rng = thread_rng();

    // Generate a random 256-bit integer as the private key
    let private_key: [u8; 32] = rng.gen();

    // Convert the private key to a secp256k1 SecretKey object
    let secret_key = SecretKey::from_slice(&private_key).unwrap();

    // Return the private key in hexadecimal format
    secret_key
}

pub fn get_unix_timestamp() -> u64 {
    // Get the current time as a SystemTime object
    let current_time = SystemTime::now();

    // Get the duration between the current time and the Unix epoch
    let duration_since_epoch = current_time.duration_since(UNIX_EPOCH).unwrap();

    // Get the number of seconds since the Unix epoch as a u64 value
    let unix_timestamp = duration_since_epoch.as_secs();

    unix_timestamp
}
