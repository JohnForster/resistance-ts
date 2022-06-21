import Cookies from 'js-cookie';
import { ThemeName } from '../themes';

type CookieDictionary = {
  themeName: ThemeName;
  playerID: string;
  playerName: string;
};

export const get = <T extends keyof CookieDictionary>(
  key: T,
): CookieDictionary[T] | undefined => {
  const value = Cookies.get(key);
  return value as CookieDictionary[T] | undefined;
};

export const set = <T extends keyof CookieDictionary>(
  key: T,
  value: CookieDictionary[T],
) => {
  return Cookies.set(key, value, { expires: 365 });
};
