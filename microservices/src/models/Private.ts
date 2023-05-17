import * as nobleSecp256k1 from '@noble/secp256k1';
import { crypto } from 'bitcoinjs-lib';
import { encrypt } from '../utils/Encryption';

import { Server } from './Server';

const { sha256 } = crypto;

export class PrivateEvent {
  private content: string;

  private user: Server;

  private kind: number;

  private receiver: string;

  constructor(
    content: string,
    kind: number,
    user: Server,
    receiverPubKey: string
  ) {
    this.user = user;
    this.content = content;
    this.kind = kind;
    this.receiver = receiverPubKey;
  }

  async getNostrMessage(): Promise<string> {
    const encryptedContent = encrypt(
      this.content,
      this.user.getPrivateKey(),
      this.receiver
    );

    const event = {
      content: encryptedContent,
      created_at: Math.floor(Date.now() / 1000),
      kind: this.kind,
      tags: [['p', this.receiver]],
      pubkey: this.user.getPublicKey(),
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
        encryptedContent, // Your note contents
      ])
    );
    // console.log(nostrTemplate)
    event.id = sha256(nostrIdTemplate).toString('hex');
    const newSig = await nobleSecp256k1.schnorr.sign(
      event.id,
      this.user.getPrivateBuffer()
    );
    event.sig = Buffer.from(newSig).toString('hex');
    return JSON.stringify(['EVENT', event]);
  }
}
