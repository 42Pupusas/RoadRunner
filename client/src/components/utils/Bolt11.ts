// metodos Bolt11 para decodificar pagos LN
import * as bolt11 from 'bolt11';

// Es importante antes de trabajar con apgos LN revisar si el pago es valido
// Los metodos regreseran  nstring vacio dificil de validar si no
export function isValidLNInvoice(invoice: string) {
  try {
    bolt11.decode(invoice);
    return true;
  } catch (error) {
    return false;
  }
}

// El hash del pago, utilizado para crear contratos
export function getInvoicePayHash(invoice: string): string | null {
  const decoded = bolt11.decode(invoice);
  const pmthashTag = decoded.tags.find((tag) => tag.tagName === 'payment_hash');
  return pmthashTag ? pmthashTag.data.toString() : null;
}

// El valor en satoshis del pago
export function getinvoiceAmount(invoice: string) {
  const decoded = bolt11.decode(invoice);
  return decoded.satoshis!;
}

// El tiempo en bloques minados para que expire el pago
export function getInvoiceExpiry(invoice: string) {
  const decoded = bolt11.decode(invoice);
  return decoded.timeExpireDate!;
}
