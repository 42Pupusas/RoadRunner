import { ECPairFactory } from 'ecpair';
import * as tinysecp from 'tiny-secp256k1';

const ECPair = ECPairFactory(tinysecp);

export class Subscription {
  private filter: {};
  private id: string;
  constructor(filter: {}) {
    // const timestamp = Math.floor(Date.now() / 1000);
    this.filter = filter;
    this.id = ECPair.makeRandom().publicKey.toString('hex');
  }

  // eslint-disable-next-line class-methods-use-this
  getNostrEvent(): string {
    return JSON.stringify(['REQ', this.id, this.filter]);
  }
  getCloseEvent(): string {
    return JSON.stringify(['CLOSE', this.id]);
  }

  getNostrId(): string {
    return this.id
  }
}
