import { RELAY_URL } from '@/components/utils/Utils';

import type { User } from '../roadrunner/User';
import { NostrEvent } from './Event';

// Metodos para notificar al servidor sobre acciones del contrato

// Detiene el trabajador escuchando el contrato
export const stopPrepay = (htlc: string, user: User): void => {
  const newPrepayReq = new NostrEvent(htlc, 20021, user.getPublicKey(), []);
  const signedRequest = user.signEvent(newPrepayReq);
  const relayConnection = new WebSocket(RELAY_URL);
  relayConnection.onopen = async () => {
    relayConnection.send(signedRequest.getNostrEvent());
  };
};

// Paga al conductor para completar el viaje
export const payDriver = (invoice: string, user: User): void => {
  const newPayReq = new NostrEvent(invoice, 20022, user.getPublicKey(), []);
  const signedRequest = user.signEvent(newPayReq);
  const relayConnection = new WebSocket(RELAY_URL);
  relayConnection.onopen = async () => {
    relayConnection.send(signedRequest.getNostrEvent());
  };
};

// Cancela el contrato, este metodo puede ser usado por conductor o pasajero
export const cancelPayment = (htlc: string, user: User): void => {
  const newCancelReq = new NostrEvent(htlc, 20023, user.getPublicKey(), []);
  const signedRequest = user.signEvent(newCancelReq);
  const relayConnection = new WebSocket(RELAY_URL);
  relayConnection.onopen = async () => {
    relayConnection.send(signedRequest.getNostrEvent());
  };
};
