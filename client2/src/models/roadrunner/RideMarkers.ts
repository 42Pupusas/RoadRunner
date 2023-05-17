import type { Icon } from 'leaflet';
import { icon } from 'leaflet';

export class LeafIcon {
  private color: string;

  private large: boolean;

  constructor(color: string, large: boolean) {
    this.color = color;
    this.large = large;
  }

  createIcon(): Icon {
    if (this.large) {
      return icon({
        iconUrl: `https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-${this.color}.png`,
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30],
      });
    }
    return icon({
      iconUrl: `https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-${this.color}.png`,
      iconAnchor: [12, 41],
      shadowSize: [41, 41],
      shadowUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
  }
}
