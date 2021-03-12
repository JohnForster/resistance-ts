import { EventFns } from '../helpers/getEventFns';
import { Instance } from '../helpers/instances';

export const landingStep = ({ waitForAll }: Partial<EventFns>) => async ({
  page,
  name,
}: Instance) => {
  await expect(page).toMatch('The Resistance', { delay: 500 });
  await expect(page).toFill('input[id=nameInput]', name);
  await expect(page).toClick('button', { text: 'Enter Name' });
  await waitForAll('landingPageComplete');
};
