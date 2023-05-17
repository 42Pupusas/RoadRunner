import { bech32 } from 'bech32';
import { ECPairFactory } from 'ecpair';
import * as tinysecp from 'tiny-secp256k1';

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

  // Metodos para recuperar los dos formatos del par de llaves
  // En la mayoria de casos usaremos strings, los metodos de encripcion se facilitan con los buffers
  getPrivateKey(): string {
    return this.privateKey.toString('hex');
  }

  getPublicKey(): string {
    // Removemos los primeros dos caracteres ya que son redundantes y Nostr no los lee
    return this.publicKey.toString('hex').substring(2);
  }

  getPrivateBuffer(): Buffer {
    return this.privateKey;
  }

  getPublicBuffer(): Buffer {
    return this.publicKey;
  }

  // POR IMPLEMENTAR
  // Bech32 permite agregar un prefijo a la lalve publica para identificar pasajero/conductor
  getUserName(prefix: string): string {
    const pubWords = bech32.toWords(this.publicKey);
    return bech32.encode(prefix, pubWords);
  }
}
