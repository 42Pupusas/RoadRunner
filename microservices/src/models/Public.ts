import { schnorr } from '@noble/curves/secp256k1';
import { crypto } from 'bitcoinjs-lib';
import { Server } from './Server';

const { sha256 } = crypto;

export class PublicEvent {
  private content: string;

  private server: Server;

  private tags: [string[]] | [];

  private kind: number;

  private id: string | null;

  constructor(
    content: string,
    kind: number,
    server: Server,
    tags: [string[]] | []
  ) {
    this.server = server;
    this.content = content;
    this.kind = kind;
    this.tags = tags;
    this.id = null;
  }

  async getNostrMessage(): Promise<string> {
    const event = {
      content: this.content,
      created_at: Math.floor(Date.now() / 1000),
      kind: this.kind,
      tags: this.tags,
      pubkey: this.server.getPublicKey(),
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
    const newSig = await schnorr.sign(event.id, this.server.getPrivateBuffer());
    event.sig = Buffer.from(newSig).toString('hex');
    return JSON.stringify(['EVENT', event]);
  }

  getNostrId(): string {
    return this.id!;
  }
}
