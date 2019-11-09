import { RoundData, SecretData, RoundName } from '../../../../shared/types/gameData';

export interface Round {
  roundName: RoundName;
  getRoundData: () => RoundData;
  getSecretData: (playerID: string) => SecretData;
}
