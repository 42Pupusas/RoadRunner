// Crea un objeto con formato de evento publico listo para publicar en Nostr
export class NostrEvent {
    private content: string;
  
    public pubkey: string;
  
    private tags: [string[]] | [];
  
    private created_at: number = Math.floor(Date.now() / 1000);
  
    private kind: number;
  
    public id: string;
  
    public sig: string;
  
    constructor(
      content: string,
      kind: number,
      pubkey: string,
      tags: [string[]] | []
    ) {
      this.pubkey = pubkey;
      this.content = content;
      this.kind = kind;
      this.tags = tags;
      this.id = "";
      this.sig = "";
    }
  
    serializeEvent(): string {
      
      const nostrSerialized =
        JSON.stringify([
          0, // Reserved for future use
          this.pubkey, // the senders myNostrPubKey
          this.created_at, // UNIX timestamp
          this.kind, // Message "kind" or type
          this.tags, // Tags identify replies/recipients
          this.content, // Your note contents
        ]);
      return nostrSerialized;
    }
  
    getNostrEvent(): string {
      return JSON.stringify(['EVENT', this]);
    }
    getNostrId(): string {
      return this.id!;
    }
  }
  