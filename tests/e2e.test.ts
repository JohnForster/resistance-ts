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
import { successfulMissionStep } from './steps/missionStep';

const url = 'http://192.168.1.154:8080/';

const showoffMode = false;
const players = showoffMode ? 10 : 2;
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
  headless: true,
  defaultViewport: {
    ...screenSize,
  },
};
describe("Let's play resistance!", () => {
  let all: ForAllFn;
  let eventFns: EventFns;
  let count = 0;

  const takeSingleScreenshot = () =>
    all(async ({ i, page }) =>
      i === 0
        ? await page.screenshot({
            path: `tests/screens/screen-${count++}.png`,
          })
        : await page.waitForTimeout(500),
    );

  beforeAll(async () => {
    eventFns = getEventFns(players);
    all = await getForAll(players, names, options);

    await all(async ({ page }) => {
      await page.emulate(puppeteer.devices['iPhone SE']);
      await page.goto(url);
      await page.waitForTimeout(500);
    });
  });

  beforeEach(async () => {
    await await new Promise((resolve) => setTimeout(resolve, 500));
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
    await all(landingStep(eventFns));
    await takeSingleScreenshot();
    await all(lobbyStep(eventFns));
    await takeSingleScreenshot();
    await all(characterStep(eventFns));
    await takeSingleScreenshot();
    await all(nominationStep(eventFns));
    await takeSingleScreenshot();
    await all(voteStep(eventFns));
    await takeSingleScreenshot();
    await all(voteResultStep(eventFns));
    await takeSingleScreenshot();
    await all(successfulMissionStep(eventFns));
    await takeSingleScreenshot();
    await all(missionResultStep(eventFns, showoffMode));
  });
});
