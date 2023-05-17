import * as fs from "fs";
import request, { CoreOptions, RequiredUriUrl } from 'request';
import { ADMINMAC, LND_ENDPOINT } from "./Utils";


export function getHodlInvoice(amount: number, hash: string, expiry: number): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const requestBody = {
      hash: Buffer.from(hash, "hex").toString("base64"),
      value: amount.toString(),
      cltv_expiry: expiry.toString(),
    };
    
    const requestOptions: CoreOptions & RequiredUriUrl = {
      url: `${LND_ENDPOINT}/v2/invoices/hodl`,
      // Work-around for self-signed certificates.
      rejectUnauthorized: false,
      json: true,
      headers: {
        "Grpc-Metadata-macaroon": fs.readFileSync(ADMINMAC).toString('hex'),
        "Content-Type": "application/json",
      },
      body: requestBody,
    };
    
    request.post(requestOptions, (error, response, body) => {
      if (body.payment_request) {
        resolve(body.payment_request);
      } else {
        reject;
      }
    });
  });
}

export function payInvoice(invoice: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const requestBody = {
      payment_request: invoice,
      fee_limit: { fixed: "500" },
      allow_self_payment: true,
    };
    const requestOptions: CoreOptions & RequiredUriUrl = {
      url: `${LND_ENDPOINT}/v1/channels/transactions`,
      json: true,
      rejectUnauthorized: false,
      headers: {
        "Grpc-Metadata-macaroon": fs.readFileSync(ADMINMAC).toString('hex'),
      },
      form: JSON.stringify(requestBody),
    };
    request.post(requestOptions, (error, response, body) => {
      resolve(body.payment_preimage);
    });
  });
}

export function settleHTLC(preimage:string): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    let settled;
    const requestBody = {
      preimage: preimage,
    };
    const requestOptions: CoreOptions & RequiredUriUrl = {
      url: `${LND_ENDPOINT}/v2/invoices/settle`,
      rejectUnauthorized: false,
      json: true,
      headers: {
        "Grpc-Metadata-macaroon": fs.readFileSync(ADMINMAC).toString('hex'),
      },
      form: JSON.stringify(requestBody),
    };
    request.post(requestOptions, (error, response, body) => {
      console.log(body)
      if (body) {
        settled = true;
      } else {
        settled = false;
      }
      resolve(settled);
    });
  });
}

export function cancelHTLC(payment_hash:string): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    let settled;
    const requestBody = {
        payment_hash
    };
    const requestOptions: CoreOptions & RequiredUriUrl = {
      url: `${LND_ENDPOINT}/v2/invoices/cancel`,
      rejectUnauthorized: false,
      json: true,
      headers: {
        "Grpc-Metadata-macaroon": fs.readFileSync(ADMINMAC).toString('hex'),
      },
      form: JSON.stringify(requestBody),
    };
    request.post(requestOptions, (error, response, body) => {
      console.log(body)
      if (body) {
        settled = true;
      } else {
        settled = false;
      }
      resolve(settled);
    });
  });
}
