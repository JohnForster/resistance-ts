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
    emitEvent('gameID', gameID);
    await expect(page).toClick('button[name="begingame"]', {
      delay: 300 + players * 100,
    });
  } else {
    [gameID] = await waitForEvent('gameID');
    await expect(page).toMatchElement('input[name="gamecode"]');
    await expect(page).toFill('input[name="gamecode"]', gameID);
    await expect(page).toClick('button', { text: 'Join Game' });
  }
  await waitForAll(`lobbyPageComplete-${label}`);
};
