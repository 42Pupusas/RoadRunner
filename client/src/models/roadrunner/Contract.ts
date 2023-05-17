// Representa un evento de contrato en Nostr
// El id es recuperado del evento
// El rideId representa el id del viaje en Nostr

export class Contract {
  private invoice: string;

  private htlc: string;

  private passenger: string;

  private driver: string;

  private id: string;

  private rideId: string | null;

  constructor(
    driver: string,
    passenger: string,
    invoice: string,
    htlc: string,
    id: string
  ) {
    this.driver = driver;
    this.passenger = passenger;
    this.invoice = invoice;
    this.htlc = htlc;
    this.id = id;
    this.rideId = null;
  }

  getContractId(): string {
    return this.id;
  }

  setContractId(id: string) {
    this.id = id;
  }

  getHTLC(): string {
    return this.htlc;
  }

  setHTLC(id: string) {
    this.id = id;
  }

  getInvoice(): string {
    return this.invoice;
  }

  setInvoice(invoice: string) {
    this.invoice = invoice;
  }

  getDriver(): string {
    return this.driver;
  }

  setDriver(driver: string) {
    this.driver = driver;
  }

  getPassenger(): string {
    return this.passenger;
  }

  setPassenger(passenger: string) {
    this.passenger = passenger;
  }

  getRideId(): string {
    return this.rideId!;
  }

  setRideId(id: string) {
    this.rideId = id;
  }
}
