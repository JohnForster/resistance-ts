import { EventFns } from '../helpers/getEventFns';
import { Instance } from '../helpers/instances';

export const successfulMissionStep = (
  { waitForAll }: Partial<EventFns>,
  { label }: { label?: number | string } = {},
) => async ({ page }: Instance) => {
  await page.waitForTimeout(500);
  const isOnMission = !!(await page.evaluate(
    () => document.querySelector('#missionbutton')?.textContent,
  ));

  if (isOnMission) {
    await expect(page).toClick('button', { text: 'Success' });
    await expect(page).toClick('button', { text: 'Submit' });
  }

  await waitForAll(`missionComplete-${label}`);
};

export const failedMissionStep = (
  { waitForAll }: Partial<EventFns>,
  { label }: { label?: number | string } = {},
) => async ({ page }: Instance) => {
  await page.waitForTimeout(500);
  const isOnMission = !!(await page.evaluate(
    () => document.querySelector('#missionbutton')?.textContent,
  ));

  if (isOnMission) {
    await expect(page).toClick('button', { text: 'Fail' });
    await expect(page).toClick('button', { text: 'Submit' });
  }

  await waitForAll(`missionComplete-${label}`);
};
