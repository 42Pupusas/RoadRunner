import { RELAY_URL } from '@/components/utils/Utils';
import { Subscription } from '@/models/nostr/Subscription';
import { Ride } from '@/models/roadrunner/Ride';

import { Contract } from '../roadrunner/Contract';
import { Profile } from '../roadrunner/Profile';
import type { User } from '../roadrunner/User';

// FUNCIONES PARA ENCONTRAR EVENTOS DE NOSTR

// Buscar un viaje por id
export const findRideById = async (rideId: string): Promise<Ride | null> => {
  return new Promise<Ride | null>((resolve) => {
    const rideSubscription = new Subscription({
      ids: [rideId],
    });
    const relayConnection = new WebSocket(RELAY_URL);
    if (!relayConnection) resolve(null);

    relayConnection.onopen = () => {
      relayConnection?.send(rideSubscription.getNostrEvent());
    };

    relayConnection.onmessage = (msg): void => {
      const [type, , nostrEvent] = JSON.parse(msg.data);

      if (type === 'EOSE') {
        relayConnection.close();
      }

      if (type !== 'EVENT') {
        resolve(null);
      } else {
        const { content } = nostrEvent;
        const { passenger, from, to, price } = JSON.parse(content);
        relayConnection.close();
        const ride = new Ride(passenger, from, to, price);
        resolve(ride);
      }
    };

    relayConnection.onerror = () => {
      resolve(null);
    };

    relayConnection.onclose = () => {
      resolve(null);
    };
  });
};
// Buscar el ultimo viaje posteado
// Como los viajes se postean bajo un tipo reemplazable (10420),
// solo puede existir un evento en el relay publicado por el usuario
export const findMyRide = async (user: User): Promise<Ride | null> => {
  if (!user) return null;
  return new Promise<Ride | null>((resolve) => {
    const rideSubscription = new Subscription({
      kinds: [10420],
      authors: [user.getPublicKey()],
    });
    const relayConnection = new WebSocket(RELAY_URL);
    if (!relayConnection) resolve(null);

    relayConnection.onopen = () => {
      relayConnection?.send(rideSubscription.getNostrEvent());
    };

    relayConnection.onmessage = (msg): void => {
      const [type, , nostrEvent] = JSON.parse(msg.data);

      if (type === 'EOSE') {
        relayConnection.close();
      }

      if (type !== 'EVENT') {
        resolve(null);
      } else {
        const { content, id } = nostrEvent;
        if (!content) return;
        const { passenger, from, to, price } = JSON.parse(content);
        relayConnection.close();
        const ride = new Ride(passenger, from, to, price);
        ride.setRideID(id);
        resolve(ride);
      }
    };

    relayConnection.onerror = () => {
      resolve(null);
    };

    relayConnection.onclose = () => {
      resolve(null);
    };
  });
};
// Encuentra un evento de contrato activo.
// El filtro 'limit' busca los ultimos dos eventos de este tipo
// Si el estado del ultimo evento es 'aceptado', retorna los datos
// Si el estado es 'offered', 'canceled', o 'settled', regresa nulo
export const findMyContract = async (user: User): Promise<Contract | null> => {
  if (!user) return null;
  return new Promise<Contract | null>((resolve) => {
    // const timestamp = Math.floor(Date.now() / 1000) - 800;

    const rideSubscription = new Subscription({
      kinds: [4200],
      '#p': [user.getPublicKey()],
      limit: 2,
    });
    const relayConnection = new WebSocket(RELAY_URL);
    if (!relayConnection) resolve(null);

    relayConnection.onopen = () => {
      relayConnection?.send(rideSubscription.getNostrEvent());
    };

    relayConnection.onmessage = (msg): void => {
      const [type, , nostrEvent] = JSON.parse(msg.data);
      if (type === 'EOSE') {
        relayConnection.close();
      }

      if (type !== 'EVENT') {
        resolve(null);
      } else {
        const { content, tags, id } = nostrEvent;
        const { htlc, invoice, status } = JSON.parse(content);
        if (status === 'settled') {
          resolve(null);
        }
        if (status !== 'accepted') return;
        relayConnection.close();
        const contract = new Contract(
          user.getPublicKey(),
          tags[1][1],
          invoice,
          htlc,
          id
        );
        contract.setRideId(tags[2][1]);
        resolve(contract);
      }
    };

    relayConnection.onerror = () => {
      resolve(null);
    };

    relayConnection.onclose = () => {
      resolve(null);
    };
  });
};
// Encuentra un perfil por su llave publica
export const findProfileByPublicKey = async (
  publicKey: string
): Promise<Profile | null> => {
  return new Promise<Profile | null>((resolve) => {
    const profileSubscription = new Subscription({
      kinds: [0],
      authors: [publicKey],
    });
    const relayConnection = new WebSocket(RELAY_URL);
    if (!relayConnection) resolve(null);

    relayConnection.onopen = () => {
      relayConnection?.send(profileSubscription.getNostrEvent());
    };

    relayConnection.onmessage = (msg): void => {
      const [type, , nostrEvent] = JSON.parse(msg.data);

      if (type === 'EOSE') {
        relayConnection.close();
      }

      if (type !== 'EVENT') {
        resolve(null);
      } else {
        const { content, pubkey, id } = nostrEvent;
        if (!content) return;
        const { username, car, avatar, carAvatar } = JSON.parse(content);
        relayConnection.close();
        const profile = new Profile(
          pubkey,
          username,
          car,
          avatar,
          carAvatar,
          id
        );
        resolve(profile);
      }
    };

    relayConnection.onerror = () => {
      resolve(null);
    };

    relayConnection.onclose = () => {
      resolve(null);
    };
  });
};
// Encuentra un evento de rating por su llave publica
export const findRatingByPublicKey = async (
  publicKey: string
): Promise<string | null> => {
  return new Promise<string | null>((resolve) => {
    const ratingSubscription = new Subscription({
      kinds: [4222],
      '#p': [publicKey],
      limit: 1,
    });
    const relayConnection = new WebSocket(RELAY_URL);
    if (!relayConnection) resolve(null);

    relayConnection.onopen = () => {
      relayConnection?.send(ratingSubscription.getNostrEvent());
    };

    relayConnection.onmessage = (msg): void => {
      const [type, , nostrEvent] = JSON.parse(msg.data);

      if (type === 'EOSE') {
        relayConnection.close();
      }

      if (type !== 'EVENT') {
        resolve(null);
      } else {
        const { content } = nostrEvent;
        if (!content) return;
        relayConnection.close();
        resolve(content);
      }
    };

    relayConnection.onerror = () => {
      resolve(null);
    };
  });
};
