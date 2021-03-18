import dns from 'dns';
import os from 'os';

export default (): Promise<string> =>
  new Promise((resolve): void => {
    const hostName = os.hostname();
    dns.lookup(hostName, (_, address) => {
      resolve(address);
    });
  });
