import React, { useState } from 'react';
import { GameData } from '@shared/types/gameData';

import Page from '../../components/page/page';
import listString from '../../helpers/listString';
import ProgressBar from '../../components/progressBar/progressBar';

import * as Styled from './styled';
interface Props {
  game: GameData<'voting'>;
  submitVote: (playerApproves: boolean) => void;
}

export const VotingPage: React.FC<Props> = (props) => {
  const [playerApproves, setPlayerApproves] = useState<boolean>(null);
  const { roundData, secretData } = props.game;
  console.log('secretData:', secretData);
  return (
    <Page>
      <ProgressBar history={props.game.history} rounds={props.game.rounds} />
      <h3>{props.game.leaderName} has nominated</h3>
      <h2>{listString(roundData.nominatedPlayers.map((p) => p.name))}</h2>
      <h3>
        to undertake this mission. Do you think this mission should go ahead?
      </h3>
      {!!secretData ? (
        <>
          {/* When the player has already made a decision. */}
          <Styled.ThumbContainer>
            {props.game.secretData.playerApproves ? '👍' : '👎'}
          </Styled.ThumbContainer>
          <p>Waiting for {listString(roundData.unconfirmedPlayerNames)}</p>
        </>
      ) : (
        <>
          <Styled.ButtonContainer>
            <Styled.VoteButton
              onClick={(): void => setPlayerApproves(true)}
              isGreyed={playerApproves === false}
            >
              👍
            </Styled.VoteButton>
            <Styled.VoteButton
              onClick={(): void => setPlayerApproves(false)}
              isGreyed={playerApproves === true}
            >
              👎
            </Styled.VoteButton>
          </Styled.ButtonContainer>
          <button
            disabled={playerApproves === null}
            onClick={() => props.submitVote(playerApproves)}
          >
            Submit
          </button>
        </>
      )}
    </Page>
  );
};
