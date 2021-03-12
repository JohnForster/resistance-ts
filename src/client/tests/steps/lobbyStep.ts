import { Instance } from '../helpers/instances';
import { EventFns } from '../helpers/getEventFns';

export const lobbyStep = ({
  emitEvent,
  waitForAll,
  waitForEvent,
}: Partial<EventFns>) => async ({ page, i, players }: Instance) => {
  let gameId: string;

  if (i === 0) {
    await expect(page).toClick('button', { text: 'Host Game' });
    await expect(page).toMatchElement('#gameId');
    await page.waitForSelector('#gameId');
    const gameId = await page.evaluate(
      () => document.querySelector('#gameId').textContent,
    );
    emitEvent('gameId', gameId);
    await expect(page).toClick('button[name="begingame"]', {
      delay: 300 + players * 100,
    });
  } else {
    [gameId] = await waitForEvent('gameId');
    await expect(page).toMatchElement('input[name="gamecode"]');
    await expect(page).toFill('input[name="gamecode"]', gameId);
    await expect(page).toClick('button', { text: 'Join Game' });
  }
  await waitForAll('lobbyPageComplete');
};
