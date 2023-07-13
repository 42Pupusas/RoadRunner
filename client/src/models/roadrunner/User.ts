import { decrypt, encrypt } from '@/components/utils/Encryption';
import { schnorr } from '@noble/curves/secp256k1';
import { bech32 } from 'bech32';
import { sha256 } from 'bitcoinjs-lib/src/crypto';
import { ECPairFactory } from 'ecpair';
import * as tinysecp from 'tiny-secp256k1';
import { NostrEvent } from '../nostr/Event';

// Crea un par de llaves (privada-publica) a partir de una llave privada en forma de texto
// Esta clase se utiliza para firmar los eventos de Nostr despachados
const ECPair = ECPairFactory(tinysecp);
export class User {
  private privateKey: Buffer | undefined;
  private nostr: any | null; // Assuming `nostr` can be any object
  private publicKey: Buffer | undefined;

  private constructor() { }

  static async create(privateKey: string | null, nostr: any): Promise<User> {
    let user = new User();
    user.nostr = nostr;

    if (nostr) {
      user.publicKey = await nostr.getPublicKey();
    } else if (privateKey) {
      const keyBuffer = Buffer.from(privateKey, 'hex');
      const keyPair = ECPair.fromPrivateKey(keyBuffer);
      user.privateKey = keyPair.privateKey!;
      user.publicKey = keyPair.publicKey;
    } else {
      throw new Error("Must provide either privateKey or nostr");
    }

    return user;
  }

  getPublicKey(): string {
    // Remove the first two characters as they are redundant and Nostr doesn't read them
    if (this.privateKey) { return this.publicKey!.toString('hex').substring(2); } else { return this.publicKey!.toString('hex'); }
  }

  getPublicBuffer(): Buffer {
    return this.publicKey!;
  }


  // POR IMPLEMENTAR
  // Bech32 permite agregar un prefijo a la llave publica para identificar pasajero/conductor
  getUserName(prefix: string): string {
    const pubWords = bech32.toWords(this.publicKey!);
    return bech32.encode(prefix, pubWords);
  }

  async signEvent(event: NostrEvent): Promise<NostrEvent> {
    let signedEvent: NostrEvent;

    if (this.privateKey) {
      // Sign event with privateKey
      event.id = sha256(Buffer.from(event.serializeEvent())).toString('hex');
      const newSig = schnorr.sign(event.id, this.privateKey);
      event.sig = Buffer.from(newSig).toString('hex');
      signedEvent = event;
    } else if (this.nostr) {
      // Sign event with nostr object
      const signedEventData = await this.nostr.signEvent(event);
      signedEvent = new NostrEvent(signedEventData.content, signedEventData.kind, signedEventData.pubkey, signedEventData.tags);
      signedEvent.id = signedEventData.id;
      signedEvent.sig = signedEventData.sig;
    } else {
      // Throw error if both privateKey and nostr object are null
      throw new Error('Unable to sign event. Both privateKey and nostr object are null.');
    }

    return signedEvent;
  }




  async encryptText(text: string, receiver: string): Promise<string> {
    if (this.privateKey) {
      const cyphertext = encrypt(
        this.privateKey!.toString('hex'),
        receiver,
        text
      );
      return cyphertext;
    } else {
      const cyphertext: string = await this.nostr.nip04.encrypt(receiver, text);
      return cyphertext;
    }
  }

  async decryptText(cyphertext: string, sender: string): Promise<string> {
    if (this.privateKey) {
      const dmsg = decrypt(this.privateKey!.toString('hex'), sender, cyphertext);
      return dmsg;
    } else {
      const dmsg: string = await this.nostr.nip04.decrypt(sender, cyphertext);
      return dmsg;
    }
  }
}
