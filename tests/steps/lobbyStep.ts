import { Instance } from '../helpers/instances';
import { EventFns } from '../helpers/getEventFns';

export const lobbyStep = (
  { emitEvent, waitForAll, waitForEvent }: Partial<EventFns>,
  { label }: { label?: number | string } = {},
) => async ({ page, i, players }: Instance) => {
  let gameID: string;

  if (i === 0) {
    await expect(page).toClick('button', { text: 'Host Game' });
    await expect(page).toMatchElement('#gameID');
    await page.waitForSelector('#gameID');
    const gameID = await page.evaluate(
      () => document.querySelector('#gameID').textContent,
    );
    emitEvent(`gameID-${label}`, gameID);
    await waitForAll(`gameIDRecieved-${label}`);
    await page.waitForTimeout(500);
    // await expect(page).toClick('button', {
    //   text: 'Begin Game',
    // });
  } else {
    [gameID] = await waitForEvent(`gameID-${label}`);
    await expect(page).toMatchElement('input[name="gamecode"]');
    await waitForAll(`gameIDRecieved-${label}`);
    await expect(page).toFill('input[name="gamecode"]', gameID);
    await expect(page).toClick('button', { text: 'Join Game' });
  }
  await waitForAll(`lobbyPageComplete-${label}`);
};
