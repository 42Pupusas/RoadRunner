import { ECPairFactory } from 'ecpair';
import * as tinysecp from 'tiny-secp256k1';

const ECPair = ECPairFactory(tinysecp);

// Crea un evento de subscripcion para pedir eventos de Nostr
// El filtro es un objeto con llaves determinadas por NIP01
// El id es unico y aleatorio para cada evento, permite detener la subscripcion
export class Subscription {
  private filter: {};

  private id: string;

  constructor(filter: {}) {
    this.filter = filter;
    this.id = ECPair.makeRandom().publicKey.toString('hex');
  }

  getNostrEvent(): string {
    return JSON.stringify(['REQ', this.id, this.filter]);
  }

  getId(): string {
    return this.id;
  }
}
