import type { LatLng } from 'leaflet';

import { RELAY_URL } from '@/components/utils/Utils';

import type { User } from './User';
import { NostrEvent } from '../nostr/Event';

// Crea una instancia de un viaje posteado. Representa un evento posteado a Nostr y contiene la misma estructura.
// El id queda vacio hasta que se manda el mensaje a Nostr, y se rellena con el id del evento de Nostr

export class Ride {
  private passenger: string;

  private from: LatLng;

  private to: LatLng;

  private price: number;

  private id: string | null;

  constructor(passenger: string, from: LatLng, to: LatLng, price: number) {
    this.passenger = passenger;
    this.from = from;
    this.to = to;
    this.price = price;
    this.id = null;
  }

  getUserPublicKey(): string {
    return this.passenger;
  }

  getRideFrom(): LatLng {
    return this.from;
  }

  getRideTo(): LatLng {
    return this.to;
  }

  getPrice(): number {
    return this.price;
  }

  getRideId(): string {
    return this.id!;
  }

  // Usado por el conductor para estabelcer un id ya que no manda un mensaje
  // El id es recuperado del evento de Nostr que escucha el conductor
  setRideID(id: string) {
    this.id = id;
  }

  // Formato para enviar a Nostr
  getRideMessage(): string {
    return JSON.stringify({
      passenger: this.passenger,
      from: this.from,
      to: this.to,
      price: this.price,
    });
  }

  getDistanceInKm(): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (this.from.lat - this.to.lat) * (Math.PI / 180);
    const dLon = (this.from.lng - this.to.lng) * (Math.PI / 180);
    const lat1 = this.from.lat * (Math.PI / 180);
    const lat2 = this.to.lat * (Math.PI / 180); // Corrected line
  
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  }
  
  

  // Envia el evento del viaje a Nostr y establece el id del viaje
  sendRideRequest(user: User): Promise<string> {
    return new Promise(async (resolve) => {
      const content = JSON.stringify({
        passenger: this.passenger,
        from: this.from,
        to: this.to,
        price: this.price,
      });
      const newNostrEvent = new NostrEvent(content, 10420, user.getPublicKey(), []);
      const signedEvent: NostrEvent = await user.signEvent(newNostrEvent);
      const relayConnection = new WebSocket(RELAY_URL);
      relayConnection.onopen = async () => {
        console.log('Sending ride request to Nostr', signedEvent.getNostrEvent());
        relayConnection.send(signedEvent.getNostrEvent());
        relayConnection.close();
        resolve(newNostrEvent.getNostrId());
      };
    });
  }
}
