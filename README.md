# Roadrunner

Roadrunner is an open-source ride-sharing client hosted at here[https://roadrunner.lat], utilizing Nostr and Lightning to implement a peer-to-peer, non-custodial solution for ride-sharing.

## Web Client

The web client serves as the minimum viable product (MVP) for the ride-sharing service. It is designed to be device and browser agnostic. No user information is stored beyond their sessions, and location events are replaceable, ensuring that no geolocation data is saved on the relay. The client does not track user locations, and the map displayed is a static tile set. The only information stored on the relay about users is the history of HTLC (Hash Time-Locked Contract) transactions handled by the backend microservices, along with their statuses. This allows the client to aggregate these transactions and build a comprehensive reputation system for users and drivers.

The client is responsible for aggregating ride requests and enabling drivers to offer LN (Lightning Network) invoices to the server for HTLC creation. It displays offers to users, retrieves invoice status events, and allows users to send cancellation events. Additionally, it aggregates profile and reputation events.

## Microservices

Two independent bots are running on the server, listening for user events on the relay. Each bot holds a copy of a private key, allowing users to identify backend events using the server's public key. This also enables other clients to tag these microservices, effectively transforming the Nostr relay into a public API.

### Invoice Creator

The Invoice Creator microservice listens for invoices from drivers and generates HTLCs to offer to passengers. It publishes the HTLCs to the relay as offer events for passengers.

### Invoice Coordinator

The Invoice Coordinator microservice subscribes to HTLCs and posts status changes and settlements to the relay. It listens for confirmation/cancellation events from passengers in order to settle or cancel invoices.

## NIP Possibility

The client and backend microservices communicate using specific types of Nostr events over a shared relay. This design makes the backend client-agnostic, allowing it to accept messages from any client that wishes to implement its own ride-sharing service. The backend services can be scaled vertically or horizontally to listen to other relays.

## Support the Project

I am an independent developer from El Salvador, working a full-time job while building open-source applications. If you would like to support the project, you can make a donation to the following address: