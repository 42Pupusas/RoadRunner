use serde::{Deserialize, Serialize };

#[derive(Serialize, Debug)]
pub struct InvoiceRequest {
    pub value: u64,
}

#[derive(Serialize, Debug, Deserialize)]
pub struct InvoiceResponse {
    pub r_hash: String,
    pub payment_request: String,
}

#[derive(Serialize, Debug)]
pub struct HTLCRequest {
    pub value: u64,
    pub hash: String,
    pub expiry: u64,
}

#[derive(Serialize, Deserialize)]
pub struct HTLCResponse {
    pub payment_request: String,
    pub add_index: String,
    pub payment_addr: String,
}

#[derive(Serialize, Debug, Deserialize)]
pub struct CheckResponseBody {
    pub r_hash: String,
    pub payment_request: String,
    pub settled: bool,
}
