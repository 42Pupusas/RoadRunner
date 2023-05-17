import { ECPairFactory } from 'ecpair';
import * as tinysecp from 'tiny-secp256k1';
import { Subscription } from './models/Subscription';
import WebSocket from 'ws';

import * as fs from "fs";
import { Server } from './models/Server';
import { Contract } from './models/Contract';
import { cancelHTLC, payInvoice, settleHTLC } from './utils/LNDTools';
import { getInvoicePayHash, getinvoiceAmount, getInvoiceExpiry } from './utils/Bolt11';
import { ADMINMAC, RELAY_ENDPOINT } from './utils/Utils';
import { PublicEvent } from './models/Public';


const ECPair = ECPairFactory(tinysecp);


const serverKeys = new Server();


const relay = new WebSocket(RELAY_ENDPOINT);
const subId = ECPair.makeRandom().privateKey!.toString("hex");
const rideFilter = {
    kinds: [20020, 20021, 20022, 20023, 20024]
};

const findContract = (id: string): Promise<Contract> => {
    return new Promise((resolve, reject) => {
        const subId = ECPair.makeRandom().privateKey!.toString("hex");
        const contractFilter = {
            'ids': [id]
        };
        const contractSub = new Subscription(contractFilter);
        const contractrelay = new WebSocket(RELAY_ENDPOINT);
        contractrelay.onopen = () => {
            contractrelay.send(contractSub.getNostrEvent());
        }

        contractrelay.onmessage = (msg) => {
            const [type, , eventCell] = JSON.parse(msg.data.toString());
            if (type !== "EVENT") return;
            if (!eventCell) return;
            const { content, pubkey, tags } = eventCell;
            const { htlc, invoice } = JSON.parse(content);
            const retrievedContract = new Contract(tags[0][1], tags[1][1], tags[2][1], invoice);
            retrievedContract.setHTLC(htlc);
            resolve(retrievedContract);
            contractrelay.close();
        }

        contractrelay.onerror = (error) => {
            reject(error);
        }
    });
}

const riderSub = new Subscription(rideFilter);
let invoiceWS: WebSocket | null = null;

relay.onopen = () => {
    console.log("Waiting for Invoices:");
    relay.send(riderSub.getNostrEvent());
    const beat = new PublicEvent('thud', 20024, serverKeys, []);
    setInterval(async () => {
        const beatMsg = await beat.getNostrMessage();
        relay.send(beatMsg);
    }, 30000)
}

relay.onmessage = async (msg) => {
    const [type, , eventCell] = JSON.parse(msg.data.toString());
    if (type !== "EVENT") return;
    if (!eventCell) return;
    const { content, pubkey, kind, tags } = eventCell;
    if (kind === 20011) {
        return;
    }
    if (kind === 20020) {

        console.log(content)
        const oldContract = await findContract(content);
        console.log(oldContract)

        const paymentHashBase64 = Buffer.from(getInvoicePayHash(oldContract.getHTLC())!, "hex")
            .toString("base64url")
            .padEnd(44, "=");
        console.log("Passenger chose a ride, subscribing to HTLC:");
        invoiceWS = new WebSocket(
            `wss://localhost:8080/v2/invoices/subscribe/${paymentHashBase64}?method=GET`,
            {
                // Work-around for self-signed certificates.
                rejectUnauthorized: false,
                headers: {
                    "Grpc-Metadata-Macaroon": fs.readFileSync(ADMINMAC).toString('hex'),
                },
            }
        );
        if (!invoiceWS) return;
        invoiceWS.onerror = (err) => {
            console.log("Error: " + err);
        };
        invoiceWS.onmessage = async (body) => {
            const state = JSON.parse(body.data.toString()).result.state;
            console.log(state);
            if (state === "ACCEPTED") {
                relay.send(await oldContract.getNostrMessage("accepted"))
            }
            if (state === "SETTLED") {
                relay.send(await oldContract.getNostrMessage("settled"))
                invoiceWS?.close();
                // TODO fire off a reputation event if LN tx settles
            }
            if (state === "CANCELED") {
                relay.send(await oldContract.getNostrMessage("canceled"))
                invoiceWS?.close();
                // TODO fire off a reputation event if LN tx settles
            }
        };


    }
    if (kind === 20021) {
        invoiceWS?.close();
        console.log('stop')
    }

    if (kind === 20022) {
        payInvoice(content).then((preimage) => {
            console.log('preimage',preimage);
            settleHTLC(preimage)
        })
    }

    if (kind === 20023) {
        const htlcHash = getInvoicePayHash(content);
        if (!htlcHash) return;
        const htlcBase64 = Buffer.from(htlcHash,'hex').toString('base64');
        cancelHTLC(htlcBase64)
    }

}
