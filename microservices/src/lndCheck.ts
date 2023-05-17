import { ADMINMAC, LND_ENDPOINT, RELAY_ENDPOINT } from './utils/Utils';
import fs from 'fs'
import request from 'request';

  let options = {
    url: `${LND_ENDPOINT}/v1/getinfo`,
    // Work-around for self-signed certificates.
    rejectUnauthorized: false,
    json: true,
    headers: {
      'Grpc-Metadata-macaroon': fs.readFileSync(ADMINMAC).toString('hex'),
    },
  }
  request.get(options, function(error: any, response: any, body: any) {
    console.log('BODY:', body);

  });