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
  private privateKey: Buffer;

  private publicKey: Buffer;

  constructor(pKey: string) {
    const keyBuffer = Buffer.from(pKey, 'hex');
    const keyPair = ECPair.fromPrivateKey(keyBuffer);
    this.privateKey = keyPair.privateKey!;
    this.publicKey = keyPair.publicKey;
  }

 

  getPublicKey(): string {
    // Removemos los primeros dos caracteres ya que son redundantes y Nostr no los lee
    return this.publicKey.toString('hex').substring(2);
  }

  getPublicBuffer(): Buffer {
    return this.publicKey;
  }

  // POR IMPLEMENTAR
  // Bech32 permite agregar un prefijo a la llave publica para identificar pasajero/conductor
  getUserName(prefix: string): string {
    const pubWords = bech32.toWords(this.publicKey);
    return bech32.encode(prefix, pubWords);
  }

  signEvent(event: NostrEvent): NostrEvent {
    event.id = sha256(Buffer.from(event.serializeEvent())).toString('hex');
    const newSig = schnorr.sign(event.id, this.privateKey);
    event.sig = Buffer.from(newSig).toString('hex');
    return event;
  }

  encryptText(text: string, receiver: string): string {
    const cyphertext = encrypt(
      this.privateKey.toString('hex'),
      receiver,
      text
    );
    return cyphertext;  
  }

  decryptText(cyphertext: string, sender: string): string {
    const dmsg = decrypt(this.privateKey.toString('hex'), sender, cyphertext);
    return dmsg;
  }
}
