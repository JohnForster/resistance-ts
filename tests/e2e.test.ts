import { setDefaultOptions as setExpectPuppeteerOptions } from 'expect-puppeteer';
import puppeteer from 'puppeteer';
import { ForAllFn, getForAll } from './helpers/instances';
import { EventFns, getEventFns } from './helpers/getEventFns';
import { voteResultStep } from './steps/voteResultStep';
import { landingStep } from './steps/landingStep';
import { lobbyStep } from './steps/lobbyStep';
import { characterStep } from './steps/characterStep';
import { failedVoteStep } from './steps/voteStep';
import { nominationStep } from './steps/nominationStep';
import { doSucessfulRound } from './helpers/successfulRound';
import { gameOverStep } from './steps/gameOverStep';
import { doFailedRound } from './helpers/failedRound';

const url = 'http://192.168.1.154:8080/';

const showoffMode = false;
const players = showoffMode ? 10 : 5;
const screenSize = {
  height: 667,
  width: 500,
};

const names = [
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
];

const devices = ['iPhone SE'];

jest.setTimeout(15_000 + players * 1500);
setExpectPuppeteerOptions({ timeout: 500 + players * 100 });

const options: puppeteer.PuppeteerNodeLaunchOptions = {
  headless: showoffMode ? false : true,
  defaultViewport: {
    ...screenSize,
  },
};

describe(`Let's play resistance with ${players} players!`, () => {
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
    all = await getForAll(players, names, devices, options);

    await all(async ({ page, device }) => {
      await page.emulate(puppeteer.devices[device]);
    });
  });

  beforeEach(async () => {
    eventFns = getEventFns(players);
    await all(async ({ page }) => {
      await page.deleteCookie({ name: 'playerID', url });
      await page.goto(url);
      await page.waitForTimeout(500);
    });
  });

  afterAll(() =>
    all(async ({ page, browser, i }) => {
      await page.waitForTimeout(500);
      // ? Screenshots may be causing server to restart?
      await page.screenshot({ path: `tests/screens/final-${i}.png` });
      await browser.close();
    }),
  );

  // it('should take screenshots', async () => {
  //   await all(landingStep(eventFns));
  //   await takeSingleScreenshot();
  //   await all(lobbyStep(eventFns));
  //   await takeSingleScreenshot();
  //   await all(characterStep(eventFns));
  //   await takeSingleScreenshot();
  //   await all(nominationStep(1, eventFns));
  //   await takeSingleScreenshot();
  //   await all(voteStep(1, eventFns));
  //   await takeSingleScreenshot();
  //   await all(voteResultStep(1, eventFns));
  //   await takeSingleScreenshot();
  //   await all(successfulMissionStep(1, eventFns));
  //   await takeSingleScreenshot();
  //   await all(missionResultStep(1, eventFns, showoffMode));
  // });

  it('Can play a full game where the resistance win', async () => {
    await all(landingStep(eventFns));

    await all(lobbyStep(eventFns, { label: 'game1' }));
    await all(characterStep(eventFns, { label: 'game1' }));
    await doSucessfulRound(all, eventFns, { label: 'round1' });
    await doSucessfulRound(all, eventFns, { label: 'round2' });
    await doSucessfulRound(all, eventFns, { label: 'round3' });
    await all(gameOverStep(eventFns, { label: 'game1' }));
  });

  it('The spies can win from too many failed nominations ', async () => {
    await all(landingStep(eventFns));
    await all(lobbyStep(eventFns));
    await all(characterStep(eventFns));

    await all(nominationStep(eventFns, { label: 1 }));
    await all(failedVoteStep(eventFns, { label: 1 }));
    await all(voteResultStep(eventFns, { label: 1 }));

    await all(nominationStep(eventFns, { label: 2 }));
    await all(failedVoteStep(eventFns, { label: 2 }));
    await all(voteResultStep(eventFns, { label: 2 }));

    await all(nominationStep(eventFns, { label: 3 }));
    await all(failedVoteStep(eventFns, { label: 3 }));
    await all(voteResultStep(eventFns, { label: 3 }));

    await all(nominationStep(eventFns, { label: 4 }));
    await all(failedVoteStep(eventFns, { label: 4 }));
    await all(voteResultStep(eventFns, { label: 4 }));

    await all(nominationStep(eventFns, { label: 5 }));
    await all(failedVoteStep(eventFns, { label: 5 }));
    await all(voteResultStep(eventFns, { label: 5 }));

    await all(gameOverStep(eventFns, { label: 'game1' }));
  });

  it('The spies can win from sabotaging three missions', async () => {
    await all(landingStep(eventFns));

    await all(lobbyStep(eventFns, { label: 'game1' }));
    await all(characterStep(eventFns, { label: 'game1' }));
    await doFailedRound(all, eventFns, { label: 'round1' });
    await doFailedRound(all, eventFns, { label: 'round2' });
    await doFailedRound(all, eventFns, { label: 'round3' });
    await all(gameOverStep(eventFns, { label: 'game1' }));
  });

  it('Can play two games back to back', async () => {
    await all(landingStep(eventFns));

    await all(lobbyStep(eventFns, { label: 'game1' }));
    await all(characterStep(eventFns, { label: 'game1' }));
    await doSucessfulRound(all, eventFns, { label: 'round1' });
    await doSucessfulRound(all, eventFns, { label: 'round2' });
    await doSucessfulRound(all, eventFns, { label: 'round3' });
    await all(gameOverStep(eventFns, { label: 'game1' }));

    await all(lobbyStep(eventFns, { label: 'game2' }));
    await all(characterStep(eventFns, { label: 'game2' }));
    await doSucessfulRound(all, eventFns, { label: 'round4' });
    await doSucessfulRound(all, eventFns, { label: 'round5' });
    await doSucessfulRound(all, eventFns, { label: 'round6' });
    await all(gameOverStep(eventFns, { label: 'game2' }));
  });
});
