import { RoundData, SecretData } from '@shared/types/gameData';
import { RoundName } from '@server/types/enums';
type RoundName = typeof RoundName[keyof typeof RoundName];

export interface Round {
  roundName: RoundName;
  getRoundData: () => RoundData;
  getSecretData: (playerID: string) => SecretData;
}
