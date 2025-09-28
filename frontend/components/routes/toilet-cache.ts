import { AppleMapsCircle } from 'expo-maps/build/apple/AppleMaps.types';
import { LRUCache } from 'typescript-lru-cache';


export class ToiletCache {
  private cache: LRUCache<string, AppleMapsCircle[]>;

  constructor() {
    this.cache = new LRUCache<string, AppleMapsCircle[]>();
  }

  set(lat: number, lng: number, toilets: AppleMapsCircle[]): void {
    this.cache.set(this.keyFrom(lat, lng), toilets);
  }

  get(lat: number, lng: number): AppleMapsCircle[] | null {
    const result = this.cache.get(this.keyFrom(lat, lng));
    if (result) {
      return result;
    }
    return null;
  }

  private keyFrom(lat: number, lng: number): string {
    return `${lat},${lng}`;
  }
}