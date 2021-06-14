import shuffle from 'lodash/shuffle';
import { EventFns } from '../helpers/getEventFns';
import { Instance } from '../helpers/instances';

export const nominationStep = (
  { waitForAll }: Partial<EventFns>,
  { label }: { label?: number | string } = {},
) => async ({ page, players, device }: Instance) => {
  await expect(page).toMatch(/(Waiting for \w+ to nominate|Nominate)/);
  const playerNames = await page.evaluate(() =>
    Array.from(document.querySelectorAll('#nominatename')).map(
      (el) => el.textContent,
    ),
  );

  const isNominating = !!playerNames.length;
  if (isNominating) {
    expect(playerNames.length).toEqual(players);

    // Minging hack to get number of people to nominate
    const count = parseInt(
      await page.evaluate(
        () => document.querySelector('#currentround').textContent[0],
      ),
      10,
    );

    const nominations = shuffle(playerNames).slice(0, count);
    await Promise.all(
      nominations.map((name) => expect(page).toClick('button', { text: name })),
    );
    expect(page).toClick('button', { text: 'Submit' });
  }
  await waitForAll(`nominationComplete-${label}`);
};
