import puppeteer, { PuppeteerNodeLaunchOptions } from 'puppeteer';

export type Instance = {
  i: number;
  name: string;
  browser: puppeteer.Browser;
  players: number;
  page: puppeteer.Page;
  device: string;
};

export type ForAllFn = <A = any>(fn: (i: Instance) => A) => Promise<A[]>;

export const getForAll = async (
  players: number,
  names: string[],
  devices: string[],
  options: PuppeteerNodeLaunchOptions,
) => {
  let instances = await Promise.all(
    [...Array(players).keys()].map((i) =>
      createNewInstance(
        i,
        names[i],
        devices[i % devices.length],
        players,
        options,
      ),
    ),
  );

  const all = <A>(fn: (i: Instance) => A) =>
    Promise.all(instances.map(async (i) => await fn(i)));

  return all;
};

const createNewInstance = async (
  i: number,
  name: string,
  device: string,
  players: number,
  options: PuppeteerNodeLaunchOptions,
) => {
  const args: string[] = options.headless
    ? []
    : [
        `--window-size=${options.defaultViewport.width},${options.defaultViewport.height}`,
        `--window-position=${500 * (i % 4)},${Math.floor(i / 4) * 500}`,
      ];

  const browser = await puppeteer.launch({ ...options, args });
  const pages = await browser.pages();
  const page = pages[0];

  return {
    i,
    name,
    browser,
    device,
    page,
    players,
  };
};
