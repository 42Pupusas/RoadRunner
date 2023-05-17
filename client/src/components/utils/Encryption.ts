import * as nobleSecp256k1 from '@noble/secp256k1';
import { randomBytes } from 'crypto';
import * as cryptoTools from 'crypto';

// Metodos de eencripcion par a par
// Usamos lallave privada del que manda y la publica del que recibe
// Ambos pueden desencriptar el mensaje
export function encrypt(privkey: string, pubkey: string, text: string): string {
  const key = nobleSecp256k1.getSharedSecret(privkey, `02${pubkey}`, true);
  const iv = Uint8Array.from(randomBytes(16));
  const cipher = cryptoTools.createCipheriv('aes-256-cbc', key.slice(1), iv);
  // console.log("latest error:", privkey, pubkey, text);
  const encryptedMessage = cipher.update(text, 'utf8', 'base64');
  const emsg = encryptedMessage + cipher.final('base64');

  return `${emsg}?iv=${Buffer.from(iv.buffer).toString('base64')}`;
}

export function decrypt(privkey: string, pubkey: string, ciphertext: string) {
  const [emsg, iv] = ciphertext.split('?iv=');
  const key = nobleSecp256k1.getSharedSecret(privkey, `02${pubkey}`, true);
  const decipher = cryptoTools.createDecipheriv(
    'aes-256-cbc',
    key.slice(1),
    Buffer.from(iv!, 'base64')
  );
  const decryptedMessage = decipher.update(emsg!, 'base64');
  let dmsg: string;
  try {
    dmsg = decryptedMessage + decipher.final('utf8');
  } catch (e) {
    dmsg = 'error decrypting message -- the message was malformed';
  }

  return dmsg;
}
