// Bolt11 Methods
import * as bolt11 from "bolt11";

export function isValidLNInvoice(invoice: string) {
    try {
      const decodedInvoice = bolt11.decode(invoice);
      return true;
    } catch (error) {
      console.error('Invalid invoice!');
      return false;
    }
  }
  
  export function getInvoicePayHash(invoice: string): string | null {
    const decoded = bolt11.decode(invoice);
    const pmthashTag = decoded.tags.find((tag) => tag.tagName === "payment_hash");
    return pmthashTag ? pmthashTag.data.toString() : null;
  
  }
  export function getinvoiceAmount(invoice: string) {
    const decoded = bolt11.decode(invoice);
    return decoded["satoshis"]!;
  }
  export function getInvoiceExpiry(invoice: string) {
    const decoded = bolt11.decode(invoice);
    return decoded["timeExpireDate"]!
  }