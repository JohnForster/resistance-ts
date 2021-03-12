import 'expect-puppeteer';
import puppeteer from 'puppeteer';
import shuffle from 'lodash/shuffle';
import { ForAllFn, getForAll } from './helpers/instances';
import { EventFns, getEventFns } from './helpers/getEventFns';
import { voteResultStep } from './steps/voteResultStep';
import { landingStep } from './steps/landingStep';
import { lobbyStep } from './steps/lobbyStep';
import { characterStep } from './steps/characterStep';
import { voteStep } from './steps/voteStep';
import { nominationStep } from './steps/nominationStep';
import { missionResultStep } from './steps/missionResultStep';
import { failedMissionStep, successfulMissionStep } from './steps/missionStep';

const url = 'http://192.168.1.154:8080/';

const showoffMode = false;
const players = 5;
const screenSize = {
  height: 667,
  width: 500,
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

jest.setTimeout(20_000);

const options: puppeteer.PuppeteerNodeLaunchOptions = {
  headless: false,
  defaultViewport: {
    ...screenSize,
  },
};

describe("Let's play resistance!", () => {
  let all: ForAllFn;
  let eventFns: EventFns;

  beforeAll(async () => {
    eventFns = getEventFns(players);
    all = await getForAll(players, names, options);

    await all(async ({ page }) => {
      await page.emulate(puppeteer.devices['iPhone 6']);
      await page.goto(url);
      await page.waitForTimeout(500);
    });
  });

  beforeEach(async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
  });

  afterAll(() =>
    all(async ({ page, browser, i }) => {
      await page.waitForTimeout(500);
      // ? Screenshots may be causing server to restart?
      await page.screenshot({ path: `tests/screens/page-${i}.png` });
      await browser.close();
    }),
  );

  it('should play a game of resistance', async () => {
    // TODO FP-TS ReaderTaskEither?
    await all(landingStep(eventFns));
    await all(lobbyStep(eventFns));
    await all(characterStep(eventFns));
    await all(nominationStep(eventFns));
    await all(voteStep(eventFns));
    await all(voteResultStep(eventFns));
    await all(successfulMissionStep(eventFns));
    await all(missionResultStep(eventFns, showoffMode));
  });
});
