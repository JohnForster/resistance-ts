import { Spy } from '../../shared/types/gameData';

export const spy = (name?: string): Spy =>
  name ? { type: 'known', name } : { type: 'unknown' };
