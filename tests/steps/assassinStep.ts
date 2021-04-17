import { EventFns } from '../helpers/getEventFns';
import { ForAllFn, Instance } from '../helpers/instances';

export const successfulAssassinStep = (
  { waitForAll }: Pick<EventFns, 'waitForAll'>,
  { label }: { label?: string } = {},
) => async ({ page, i, players }: Instance) => {
  await expect(page).toMatch(/The Resistance Have Completed/);
  const potentialTargets = await page.evaluate(() =>
    Array.from(document.querySelectorAll('#targetname')).map(
      (el) => el.textContent,
    ),
  );

  const isAsssassin = !!potentialTargets.length;
  if (isAsssassin) {
    const target = potentialTargets[0].trim();
    console.log('I am an assassin!');
    expect(page).toClick('button', {
      text: target,
    });
    expect(page).toClick('button', {
      text: `Assassinate ${target}`,
    });
  }
  waitForAll(`assassination-${label}`);
};

export const failedAssassinStep = (
  all: ForAllFn,
  eventFns: EventFns,
) => async ({ page, i, players }: Instance) => {};
