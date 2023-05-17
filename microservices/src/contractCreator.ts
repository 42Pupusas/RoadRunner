import { ECPairFactory } from 'ecpair';
import * as tinysecp from 'tiny-secp256k1';
import { Subscription } from './models/Subscription';
import WebSocket from 'ws';

import * as fs from "fs";
import * as rq from "request";
import { Server } from './models/Server';
import { Contract } from './models/Contract';
import { getHodlInvoice } from './utils/LNDTools';
import { isValidLNInvoice, getInvoicePayHash, getinvoiceAmount, getInvoiceExpiry } from './utils/Bolt11';
import { decrypt } from './utils/Encryption';
import { ADMINMAC, LND_ENDPOINT, RELAY_ENDPOINT } from './utils/Utils';
import { PublicEvent } from './models/Public';
const request = rq.defaults


const ECPair = ECPairFactory(tinysecp);


const serverKeys = new Server();


const relay = new WebSocket(RELAY_ENDPOINT);
const subId = ECPair.makeRandom().privateKey!.toString("hex");
const filter = {
  kinds: [20010, 20011]
};

const newSub = new Subscription(filter);

relay.onopen = () => {
  console.log("Waiting for Invoices:");
  relay.send(newSub.getNostrEvent());
  const beat = new PublicEvent('thud', 20011, serverKeys,[]);
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
  // Validate this content!!!!!!!!
  const {invoice, passenger} = JSON.parse(content);
  
  const newContract = new Contract(pubkey, passenger, tags[0][1], invoice );
  newContract.createHTLC().then(() => {
    if (!newContract.getHTLC()) return;
    newContract.getNostrMessage('offered').then((nostr)=>{
      console.log(nostr)
      relay.send(nostr)
    });
  })
}

relay.onerror = (e) => {
  console.log(e)
}

 

