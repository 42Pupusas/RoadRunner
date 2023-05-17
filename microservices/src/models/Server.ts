export class Server {
    private publicKey: string = "06ada1d5887e72f4121b775a568a11eabce48b12d07d71bbf129643ba41f0f94";

    private privateKey: string = "0c741360c64547ca3540baca74c33587fcfcc844d39beea490e88877624eb862"
  
    getPrivateKey(): string {
        return this.privateKey;
      }
    
      getPublicKey(): string {
        return this.publicKey;
      }
    
      getPrivateBuffer(): Buffer {
        return Buffer.from(this.privateKey, 'hex');
      }
    
      getPublicBuffer(): Buffer {
        return Buffer.from(this.publicKey, 'hex');
      }
}