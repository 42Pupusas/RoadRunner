import { Subscription } from "../models/Subscription";
import { RELAY_ENDPOINT } from "./Utils";
import WebSocket from "ws";

export const getRating = (publicKey: string): Promise<number | null> => {
  return new Promise<number | null>((resolve, reject) => {
    let settledRides = 0;
    let canceledRides = 0;
    let offeredRides = 0;
    let acceptedRides = 0;

    const calculateRating = () => {
      const RCR = (settledRides / (settledRides + canceledRides)) * 100;
      const RAR = (acceptedRides / offeredRides) * 100;
      const overallRating = 0.7 * RCR + 0.3 * RAR;

      // Normalize the rating to a scale of 1-5
      const normalizedRating = (overallRating / 100) * 5;

      return parseFloat(normalizedRating.toFixed(2));
    };

    // console.log(RELAY_ENDPOINT);
    // console.log(publicKey);

    const relayConnection = new WebSocket(RELAY_ENDPOINT);
    // console.log('hello');

    if (!relayConnection) {
      reject();
    }

    // timestamp for past week to show recent ratings
    const timestamp = Math.floor(Date.now() / 1000) - 604800;
    const eventSubscriptions = new Subscription({
      kinds: [4200],
      '#p': [publicKey],
      since: timestamp,
    });

    // console.log(eventSubscriptions.getNostrEvent());

    relayConnection.onopen = () => {
      relayConnection.send(eventSubscriptions.getNostrEvent());
    };

    relayConnection.onmessage = (event) => {
      const [type, , nostrCell] = JSON.parse(event.data.toString());
      if (type === 'EOSE') {
        relayConnection.close();
      };
      if (type !== 'EVENT') return;
      const { content } = nostrCell;
      const { status } = JSON.parse(content);
      // console.log(status);
      switch (status) {
        case 'settled': {
          settledRides += 1;
          break;
        }
        case 'canceled': {
          canceledRides += 1;
          break;
        }
        case 'accepted': {
          acceptedRides += 1;
          break;
        }
        case 'offered': {
          offeredRides += 1;
          break;
        }
        default: {
          break;
        }
      }
    };

    relayConnection.onclose = () => {
      resolve(calculateRating());
    };

    relayConnection.onerror = (error) => {
      reject(error);
    };
  });
};
