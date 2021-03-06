import React, { useState } from 'react';

import Page from '../../components/page/page';
import { GameData } from 'shared';

import * as Styled from './styled';
import listString from '../../helpers/listString';
import { ContinueButton } from '../../components/continueButton/continueButton';

export interface MissionResultProps {
  game: GameData<'missionResult'>;
  confirmReady: () => void;
}

export const MissionResultPage: React.FC<MissionResultProps> = (
  props: MissionResultProps,
) => {
  const [playerWantsToContinue, setPlayerWantsToContinue] = useState<boolean>(
    false,
  );
  const roundData = props.game.roundData;

  const confirm = (): void => {
    setPlayerWantsToContinue(true);
    props.confirmReady();
  };

  const numberOfSuccesses = roundData.missionResults.success;
  const numberOfFailures = roundData.missionResults.fail;

  const buildArray = (success: number, fail: number): string[] => {
    // TODO If there is only one failure and two are required, make the failure penultimate.
    return [...Array(success).fill('✊'), ...Array(fail).fill('💀')];
  };

  const resultArray = buildArray(numberOfSuccesses, numberOfFailures);

  return (
    <Page>
      <h1>Mission No.{props.game.missionNumber} Results:</h1>
      <Styled.Results votes={resultArray}>
        {resultArray.map((r, i) => (
          <Styled.Result key={`result-${i}`}>{r}</Styled.Result>
        ))}
      </Styled.Results>
      <Styled.OverallResult numOfVotes={resultArray.length}>
        {roundData.missionSucceeded ? 'MISSION ACCOMPLISHED' : 'MISSION FAILED'}
      </Styled.OverallResult>
      <ContinueButton
        disabled={playerWantsToContinue}
        onClick={confirm}
        subtext={`Waiting for ${listString(
          roundData.unconfirmedPlayerNames,
          'and',
        )} to confirm...`}
        hideSubtext={
          !playerWantsToContinue || !roundData.unconfirmedPlayerNames
        }
      />
    </Page>
  );
};
