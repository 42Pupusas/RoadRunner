import { schnorr } from '@noble/curves/secp256k1';
import { crypto } from 'bitcoinjs-lib';

import type { User } from '../roadrunner/User';

const { sha256 } = crypto;

// Crea un objeto con formato de evento publico listo para publicar en Nostr
export class PublicEvent {
  private content: string;

  private user: User;

  private tags: [string[]] | [];

  private kind: number;

  private id: string | null;

  constructor(
    content: string,
    kind: number,
    user: User,
    tags: [string[]] | []
  ) {
    this.user = user;
    this.content = content;
    this.kind = kind;
    this.tags = tags;
    this.id = null;
  }

  getNostrMessage(): string {
    const event = {
      content: this.content,
      created_at: Math.floor(Date.now() / 1000),
      kind: this.kind,
      tags: this.tags,
      pubkey: this.user.getPublicKey(),
      id: '',
      sig: '',
    };

    const nostrIdTemplate = Buffer.from(
      JSON.stringify([
        0, // Reserved for future use
        event.pubkey, // the senders myNostrPubKey
        event.created_at, // UNIX timestamp
        this.kind, // Message "kind" or type
        event.tags, // Tags identify replies/recipients
        this.content, // Your note contents
      ])
    );
    // console.log(nostrTemplate)
    event.id = sha256(nostrIdTemplate).toString('hex');
    this.id = event.id;
    const newSig = schnorr.sign(event.id, this.user.getPrivateBuffer());
    event.sig = Buffer.from(newSig).toString('hex');
    return JSON.stringify(['EVENT', event]);
  }

  getNostrId(): string {
    return this.id!;
  }
}
