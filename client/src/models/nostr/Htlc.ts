import { RELAY_URL } from '@/components/utils/Utils';

import type { User } from '../roadrunner/User';
import { NostrEvent } from './Event';

// Metodos para notificar al servidor sobre acciones del contrato

// Detiene el trabajador escuchando el contrato
export const stopPrepay = async (htlc: string, user: User): Promise<void> => {
  const newPrepayReq = new NostrEvent(htlc, 20021, user.getPublicKey(), []);
  const signedRequest = await user.signEvent(newPrepayReq);
  const relayConnection = new WebSocket(RELAY_URL);
  relayConnection.onopen = async () => {
    relayConnection.send(signedRequest.getNostrEvent());
  };
};

// Paga al conductor para completar el viaje
export const payDriver = async (contract: string, user: User): Promise<void> => {
  const newPayReq = new NostrEvent(contract, 20022, user.getPublicKey(), []);
  const signedRequest = await user.signEvent(newPayReq);
  const relayConnection = new WebSocket(RELAY_URL);
  relayConnection.onopen = async () => {
    relayConnection.send(signedRequest.getNostrEvent());
  };
};

// Cancela el contrato, este metodo puede ser usado por conductor o pasajero
export const cancelPayment = async (contract: string, user: User): Promise<void> => {
  const newCancelReq = new NostrEvent(contract, 20023, user.getPublicKey(), []);
  const signedRequest = await user.signEvent(newCancelReq);
  const relayConnection = new WebSocket(RELAY_URL);
  relayConnection.onopen = async () => {
    relayConnection.send(signedRequest.getNostrEvent());
  };
};
