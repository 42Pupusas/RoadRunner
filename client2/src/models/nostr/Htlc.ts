import { RELAY_URL } from '@/components/utils/Utils';

import type { User } from '../roadrunner/User';
import { PublicEvent } from './Public';

// Metodos para notificar al servidor sobre acciones del contrato

// Detiene el trabajador escuchando el contrato
export const stopPrepay = (htlc: string, user: User): void => {
  const newPrepayReq = new PublicEvent(htlc, 20021, user, []);
  const relayConnection = new WebSocket(RELAY_URL);
  relayConnection.onopen = async () => {
    relayConnection.send(newPrepayReq.getNostrMessage());
  };
};

// Paga al conductor para completar el viaje
export const payDriver = (invoice: string, user: User): void => {
  const newPrepayReq = new PublicEvent(invoice, 20022, user, []);
  const relayConnection = new WebSocket(RELAY_URL);
  relayConnection.onopen = async () => {
    relayConnection.send(newPrepayReq.getNostrMessage());
  };
};

// Cancela el contrato, este metodo puede ser usado por conductor o pasajero
export const cancelPayment = (htlc: string, user: User): void => {
  const newPrepayReq = new PublicEvent(htlc, 20023, user, []);
  const relayConnection = new WebSocket(RELAY_URL);
  relayConnection.onopen = async () => {
    relayConnection.send(newPrepayReq.getNostrMessage());
  };
};
