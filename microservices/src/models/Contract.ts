import * as nobleSecp256k1 from '@noble/secp256k1';
import { crypto } from 'bitcoinjs-lib';
import { ECPairFactory, ECPairInterface } from 'ecpair';
import * as tinysecp from 'tiny-secp256k1';
import { getinvoiceAmount, getInvoiceExpiry, getInvoicePayHash, isValidLNInvoice } from '../utils/Bolt11';
import { getHodlInvoice } from '../utils/LNDTools';

const ECPair = ECPairFactory(tinysecp);
import { Server } from './Server';

const { sha256 } = crypto;

export class Contract {
  
  private server: Server;
  
  private ride: string;
  private passenger: string;
  private driver: string;

  private invoice: string;
  private htlc: string | null;
  private id: string | null;
  
  constructor(
    driver: string,
    passenger: string,
    ride: string,
    invoice: string,
  ) {
    this.driver = driver;
    this.passenger = passenger;
    this.invoice = invoice;
    this.ride = ride;
    this.id = null;
    this.server = new Server();
    this.htlc = null;
  }

  async getNostrMessage(status: string): Promise<string> {
    const contract = JSON.stringify({
      htlc: this.htlc,
      invoice: this.invoice,
      status
    })
    const event = {
      content: contract,
      created_at: Math.floor(Date.now() / 1000),
      kind: 4200,
      tags: [['p', this.driver], ['p', this.passenger], ['e', this.ride]],
      pubkey: this.server.getPublicKey(),
      id: '',
      sig: '',
    };

    const nostrIdTemplate = Buffer.from(
      JSON.stringify([
        0, // Reserved for future use
        event.pubkey, // the senders myNostrPubKey
        event.created_at, // UNIX timestamp
        event.kind, // Message "kind" or type
        event.tags, // Tags identify replies/recipients
        contract, // Your note contents
      ])
    );
    // console.log(nostrTemplate)
    event.id = sha256(nostrIdTemplate).toString('hex');
    this.id = event.id;
    const newSig = await nobleSecp256k1.schnorr.sign(
      event.id,
      this.server.getPrivateBuffer(),
    );
    event.sig = Buffer.from(newSig).toString('hex');
    return JSON.stringify(['EVENT', event]);
  }

  getNostrId(): string {
    return this.id!
  }

  getHTLC(): string {
    return this.htlc!
  }

  setHTLC(htlc: string) {
    this.htlc = htlc;
  }
  createHTLC() {
    if (!isValidLNInvoice(this.invoice)) {
      return Promise.reject(new Error('Invalid invoice'));
    }
    const paymentHash = getInvoicePayHash(this.invoice);
    if (!paymentHash) {
      return Promise.reject(new Error('Failed to get payment hash'));
    }
    const paymentAmount = getinvoiceAmount(this.invoice) + 420;
    const paymentExpiry = getInvoiceExpiry(this.invoice);
    const timestamp = Math.floor(Date.now() / 1000);
    const htlcExpiry = Math.floor((paymentExpiry - timestamp) / 600) + 5;
    console.log('hash', paymentHash)
    return new Promise((resolve, reject) => {
      getHodlInvoice(paymentAmount, paymentHash, htlcExpiry).then((hodl) => {
        console.log(hodl);
        this.htlc = hodl;
        resolve(hodl);
      }).catch((err) => {
        reject(err);
      });
    });
  }
}
