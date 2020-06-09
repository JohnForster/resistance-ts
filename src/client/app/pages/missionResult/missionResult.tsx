import React, { Fragment, useState } from 'react';

import Page from '../../components/page/page';
import { isMissionResultRound } from '../../helpers/typeGuards';
import { GameData } from '@shared/types/gameData';

import * as Styled from './styled';
import listString from '@client/app/helpers/listString';

export interface MissionResultProps {
  game: GameData;
  confirmReady: () => void;
}

const MissionResultPage: React.FC<MissionResultProps> = (props: MissionResultProps) => {
  const [playerApproves, setPlayerApproves] = useState<boolean>(null);
  const roundData = props.game.roundData;
  if (!isMissionResultRound(roundData)) throw new Error("This isn't mission result data!");

  const confirm = (): void => {
    setPlayerApproves(true);
    props.confirmReady();
  };

  // const numberOfSuccesses = roundData.missionResults.success;
  // const numberOfFailures = roundData.missionResults.fail;
  const numberOfSuccesses = 4;
  const numberOfFailures = 1;

  const resultArray: string[] = [...Array(numberOfSuccesses).fill('✊'), ...Array(numberOfFailures).fill('💀')];

  return (
    <Page>
      <h1>Mission No.{props.game.missionNumber} Results:</h1>
      <Styled.Results votes={resultArray}>
        {resultArray.map(r => (
          <Styled.Result key={`${Math.random()}`}>{r}</Styled.Result>
        ))}
      </Styled.Results>
      <Styled.OverallResult numOfVotes={resultArray.length}>
        {roundData.missionSucceeded ? 'MISSION ACCOMPLISHED' : 'MISSION FAILED'}
      </Styled.OverallResult>
      <button disabled={playerApproves} onClick={confirm}>
        Continue
      </button>
      <If condition={!!(playerApproves && roundData.unconfirmedPlayerNames)}>
        <p>Waiting for {listString(roundData.unconfirmedPlayerNames, 'and')} to confirm...</p>
      </If>
    </Page>
  );
};

export default MissionResultPage;
