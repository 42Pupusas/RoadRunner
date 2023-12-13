# Roadrunner

Hola Pechan!!

Open source ride-sharing client hosted [here](https://roadrunner.lat), using Nostr and Lightning to implement a peer-2-peer, non-custodian solution to ride sharing. This repo contains code for a React web client and the Node microservices.

## Web Client

MVP of a ride sharing service, designed to be device and browser agnostic. No information is stored past your sessions, and location events are replaceable, so no geolocations are saved on the relay. The client does not track your location and the map is a static tile set. Only inofrmation stored on the relay about users are the history of HTLC transactions handled by the backend microservices, and their statuses. This allows the client to aggregate these and build a comprehensive reputation system for users and drivers.

Client is in charge of aggregating ride requests and allowing drivetrs to offer LN invoices to the server for HTLC creation. Displays offers for users, retrieves invoice status events and allows users to send cancellation events. Aggregates profile and reputation events.

## Microservices

Two independent bots are running on the server, listening for user events on the relay. Each bot holds a copy of a private key, so users can identify backend events by the server public key. This also allows other clients to tag these microservices, effectively turning the Nostr relay into a public API.

### Invoice Creator

Listens for invoices from drivers an produces a HTLC to offer to the passenger. Publishes the HTLC to the relay as offer events to the passenger.  

### Invoice Coordinator

Subscribes to HTLC and posts status changes and settlement to the relay. Listens for confirmation/cancellation event from passenger to settle/cancel invoice.

## Standard Ride Sharing Events

Client and backend microservices communicate using specific kinds of Nostr events over a shared relay. This makes the backend client agnostic, and in theory could accept messages from any client that wishes to implement their own ride sharing service. Backend services could be scaled vertically or horizontally to listen to other relays.

Any social client or dedicated app can integrate the backend services by using the same event kinds to contact the RoadRunner relay.

## Roadmap

The client has the follwoing steps to continue improving:

- Continue UI/UX improvements
- Implement Chat option between peers
- Review rating aggregation

We also plan to refactor all microservices to a more robust language (Rust).

## Backers

We have received the following grants and donations to continue development:

### YakiHonne Hackathon

RoadRunner has achieved 2nd place in the [YakiHonne](https://yakihonne.com/) Nostr Hack-A-Thon. We continue to participate in further rounds, so you can show your support [here](https://dorahacks.io/buidl/4976).

### Baltic Sea Circle Rally Fundraiser

[Daktari](https://twitter.com/MaunaLion) and [Cercatrova](https://twitter.com/cercatrova_21) organized an amazing fundraiser for several BTC related projects and we are proud to have received a generous donation from them to continue development. Learn more about the fundraiser [here](https://twitter.com/cercatrova_21/status/1675940788541222918).

## Support the Project

I am an independent dev from El Salvador working a full time job and building open source applications. Support this project by donating to:

BC1QRZSUAC0N0KKWZS24RQ5P3NF0UH2ZPQ86ER55CS
