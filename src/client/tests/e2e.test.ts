import events from 'events';
import expect from 'expect-puppeteer';
import puppeteer from 'puppeteer';
import shuffle from 'lodash/shuffle';
import { loadOptions } from '@babel/core';

const url = 'http://192.168.1.154:8080/';

const showoffMode = false;
const numberOfInstancesToRun = 3;
const screenSize = {
  height: 667,
  width: 375,
};

const names = shuffle([
  'John',
  'Alice',
  'Jamie',
  'Jemil',
  'Hakim',
  'Paddy',
  'Twix',
  'Amanda',
  'Ben',
  'Lola',
]);

const options = {
  headless: false,
  defaultViewport: {
    ...screenSize,
  },
};

type Instance = {
  i: number;
  name: string;
  browser: puppeteer.Browser;
  page: puppeteer.Page;
};

const createNewInstance = async (i: number) => {
  const args: string[] = [
    `--window-size=${screenSize.width},${screenSize.height}`,
    `--window-position=${screenSize.width * (i % 4)},0`,
  ];

  const browser = await puppeteer.launch({ ...options, args });
  const page = await browser.newPage();
  return {
    i,
    name: names[i],
    browser,
    page,
  };
};

const eventEmitter = new events.EventEmitter();
const waitForEvent = (eventName: string): Promise<any[]> =>
  new Promise((resolve, reject) => {
    eventEmitter.on(eventName, (...args) => resolve(args));
  });

describe('Open the page', () => {
  let instances: Instance[];

  const all = async <A>(fn: (i: Instance) => Promise<A>) =>
    await Promise.all(instances.map((i) => fn(i)));

  beforeAll(async () => {
    instances = await Promise.all(
      [...Array(numberOfInstancesToRun).keys()].map(createNewInstance),
    );
  });

  beforeEach(
    () =>
      showoffMode && all(async ({ page }) => await page.waitForTimeout(1500)),
  );

  afterAll(() =>
    all(async ({ page, browser, i }) => {
      await page.waitForTimeout(500);
      await page.screenshot({ path: `tests/screens/page-${i}.png` });
      // await browser.close();
    }),
  );

  it('landing page', () =>
    all(async ({ page, i }) => {
      const mobile = puppeteer.devices['iPhone 6'];
      page.emulate(mobile);
      await page.waitForTimeout(500);
      await page.goto(url);
      await expect(page).toMatch('The Resistance', { delay: 500 });
      const name = names[i];
      await expect(page).toFill('input[id=nameInput]', name);
      await expect(page).toClick('button', { text: 'Enter Name' });
    }));

  it('lobby page', () =>
    all(async ({ page, i }) => {
      let gameId: string;

      if (i === 0) {
        await expect(page).toClick('button', { text: 'Host Game' });
        await expect(page).toMatchElement('#gameId');
        await page.waitForSelector('#gameId');

        const gameId = await page.evaluate(
          () => document.querySelector('#gameId').textContent,
        );

        eventEmitter.emit('gameId', gameId);
        await expect(page).toClick('button[name="begingame"]', { delay: 500 });
      } else {
        [gameId] = await waitForEvent('gameId');
        await expect(page).toMatchElement('input[name="gamecode"]');
        await expect(page).toFill('input[name="gamecode"]', gameId);
        await expect(page).toClick('button', { text: 'Join Game' });
      }
    }));

  it('character page', () =>
    all(async ({ page }) => {
      await expect(page).toClick('button[name="confirmcharacter"]');
    }));

  it('nomination', () =>
    all(async ({ page }) => {
      await page.waitForTimeout(500);
      const players = await page.evaluate(() =>
        Array.from(document.querySelectorAll('#nominatename')).map(
          (el) => el.textContent,
        ),
      );

      // Need to get number of players to select?

      if (players.length) {
        const number = await page.evaluate(
          () => document.querySelector('#currentround').textContent[0],
        );
        const nominations = shuffle(players).slice(0, parseInt(number, 10));
        await Promise.all(
          nominations.map((name) =>
            expect(page).toClick('button', { text: name }),
          ),
        );
        expect(page).toClick('button', { text: 'Submit' });
      }
    }));

  it('voting', () =>
    all(async ({ page }) => {
      await expect(page).toMatch('has nominated');
    }));
});
