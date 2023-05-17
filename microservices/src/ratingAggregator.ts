// I need to open a websocket connection to the Nostr relay
// and send it a message to start listening for settled contract events
// Every time a contract is settled, this service will post a message to the
// Nostr relay with an aggregated rating for the passenger and the driver of the contract

import { ECPairFactory } from 'ecpair';
import * as tinysecp from 'tiny-secp256k1';
import { Subscription } from './models/Subscription';
import WebSocket from 'ws';

import { Server } from './models/Server';
import { RELAY_ENDPOINT } from './utils/Utils';
import { PublicEvent } from './models/Public';
import { getRating } from './utils/Nostr';


const ECPair = ECPairFactory(tinysecp);


const serverKeys = new Server();


const relay = new WebSocket(RELAY_ENDPOINT);
const subId = ECPair.makeRandom().privateKey!.toString("hex");
// UNix timestamp
const timestamp = Math.floor(Date.now() / 1000);
const rideFilter = {
    kinds: [4200, 20030],
    since: timestamp
};

const contractSub = new Subscription(rideFilter);
relay.onopen = () => {
    console.log("Waiting for Invoices:");
    relay.send(contractSub.getNostrEvent());
    const beat = new PublicEvent('thud', 20030, serverKeys, []);
    setInterval(async () => {
        const beatMsg = await beat.getNostrMessage();
        relay.send(beatMsg);
    }, 30000)
}

relay.onmessage = (msg) => {
    const [type, , eventCell] = JSON.parse(msg.data.toString());
    if (type !== "EVENT") return;
    if (!eventCell) return;
    const { content, kind, tags } = eventCell;
    if (kind !== 4200) return;
    if (!content) return;
    const { status } = JSON.parse(content);
    console.log(`Status: ${tags}`);
    if (status !== "settled") return;
  
    getRating(tags[1][1])
      .then(async newPassengerRating => {
        const passengerRatingEvent = new PublicEvent(newPassengerRating?.toString()!, 4222, serverKeys, [['p', tags[1][1]]]);
        const nostrMessage = await passengerRatingEvent.getNostrMessage();
          relay.send(nostrMessage);
          console.log(`New Passenger Rating: ${newPassengerRating}`);
      });
  
    getRating(tags[0][1])
      .then(async newDriverRating => {
        const driverRatingEvent = new PublicEvent(newDriverRating?.toString()!, 4222, serverKeys, [['p', tags[0][1]]]);
        const nostrMessage = await driverRatingEvent.getNostrMessage();
          relay.send(nostrMessage);
          console.log(`New Driver Rating: ${newDriverRating}`);
      });
  };
  