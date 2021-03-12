import puppeteer, { PuppeteerNodeLaunchOptions } from 'puppeteer';

export type Instance = {
  i: number;
  name: string;
  browser: puppeteer.Browser;
  players: number;
  page: puppeteer.Page;
};

export type ForAllFn = <A = any>(
  fn: (i: Instance) => Promise<A>,
) => Promise<A[]>;

export const getForAll = async (
  players: number,
  names: string[],
  options: PuppeteerNodeLaunchOptions,
) => {
  let instances = await Promise.all(
    [...Array(players).keys()].map((i) =>
      createNewInstance(i, names[i], players, options),
    ),
  );

  const all = async <A>(fn: (i: Instance) => Promise<A>) =>
    await Promise.all(instances.map((i) => fn(i)));

  return all;
};

const createNewInstance = async (
  i: number,
  name: string,
  players: number,
  options: PuppeteerNodeLaunchOptions,
) => {
  const args: string[] = [
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
    page,
    players,
  };
};
