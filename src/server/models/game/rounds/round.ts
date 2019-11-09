import { RoundData, SecretData, RoundName } from '../../../../shared/types/gameData';

export default interface Round {
  roundName: RoundName;
  getRoundData: () => RoundData;
  getSecretData: (playerID: string) => SecretData;
}
