import { RELAY_URL } from '@/components/utils/Utils';

import { PublicEvent } from '../nostr/Public';
import { Subscription } from '../nostr/Subscription';
import type { User } from './User';

export class Profile {
  private event: string | null;

  private publicKey: string;

  private username: string;

  private car: string | null;

  private avatar: string | null;

  private carAvatar: string | null;

  constructor(
    publicKey: string,
    username: string,
    car: string | null,
    avatar: string | null,
    carAvatar: string | null,
    event: string | null
  ) {
    this.publicKey = publicKey;
    this.username = username;
    this.car = car;
    this.avatar = avatar;
    this.carAvatar = carAvatar;
    this.event = event;
  }

  public publishProfileEvent = (user: User): void => {
    const profileContent = JSON.stringify({
      username: this.username,
      car: this.car,
      avatar: this.avatar,
      carAvatar: this.carAvatar,
    });
    const profileEvent = new PublicEvent(profileContent, 0, user, []);
    const relayConnection = new WebSocket(RELAY_URL);
    if (!relayConnection) return;

    relayConnection.onopen = () => {
      relayConnection?.send(profileEvent.getNostrMessage());
      relayConnection.close();
    };
  };

  public getPublicKey = (): string => this.publicKey;

  public getUsername = (): string => this.username;

  public getCar = (): string | null => this.car;

  public getAvatar = (): string | null => this.avatar;

  public getCarAvatar = (): string | null => this.carAvatar;

  public getEvent = (): string | null => this.event;

  // I need a function to open a websocket to the relay and send a subscription
  // for rating events (kinds [4222]) for the pubkey of this profile
  // it should returned the json parse of the content as a string
  // if there is no rating event, it should return null
  public getRating = async (): Promise<string | null> => {
    return new Promise<string | null>((resolve) => {
      const profileSubscription = new Subscription({
        kinds: [4222],
        authors: [this.publicKey],
        limit: 1,
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
          const { content } = nostrEvent;
          if (!content) return;
          relayConnection.close();
          resolve(content);
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
}
