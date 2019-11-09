/* eslint-disable @typescript-eslint/no-explicit-any */
type Constructor<T> = { new (...args: any[]): T };

const typeGuard = <T>(o: any, Class: Constructor<T>): o is T => {
  return o instanceof Class;
};

export default typeGuard;
