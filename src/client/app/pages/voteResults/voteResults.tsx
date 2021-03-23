import React from 'react';
import { GameData } from '@shared/types/gameData';
import Page from '../../components/page/page';
import listString from '../../helpers/listString';
import styled from 'styled-components';
import { ContinueButton } from '../../components/continueButton/continueButton';

interface VoteResultsProps {
  game: GameData<'votingResult'>;
  confirmReady: () => void;
}

export const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  flex-grow: 1;
`;

export const VoteResultsPage: React.FC<VoteResultsProps> = (props) => {
  const [isReady, setIsReady] = React.useState(false);

  const playerIsWaiting =
    isReady && !!props.game.roundData.unconfirmedPlayerNames?.length;

  const onClick = () => {
    setIsReady(true);
    props.confirmReady();
  };

  const voteSucceeded = props.game.roundData.voteSucceeded;
  // TODO make this less ugly
  return (
    <Page>
      <h2>Vote Results</h2>
      <MainContent>
        <h3>{voteSucceeded ? 'Nomination Succeeded' : 'Nomination Failed'}</h3>
        {props.game.roundData.votes.map((vote, i) => (
          <p key={`vote-${i}`}>
            {vote.name}: {vote.playerApproves ? '👍' : '👎'}
          </p>
        ))}
        {!voteSucceeded && (
          <h3>{props.game.roundData.votesRemaining} nominations remain...</h3>
        )}
      </MainContent>
      <ContinueButton
        onClick={onClick}
        disabled={isReady}
        subtext={`Waiting for ${listString(
          props.game.roundData.unconfirmedPlayerNames,
          'and',
        )} to confirm`}
        hideSubtext={!playerIsWaiting}
      />
    </Page>
  );
};
