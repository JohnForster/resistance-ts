import React from 'react';
import styled from 'styled-components';
import { GameData } from 'shared';
import listString from '../../helpers/listString';
import Page from '../../components/page/page';
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

const PlayerResult = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 50%;
`;

const SubTitle = styled.span`
  align-self: baseline;
  text-decoration: underline;
  padding-top: 0.6rem;
`;

export const VoteResultsPage: React.FC<VoteResultsProps> = (props) => {
  const [isReady, setIsReady] = React.useState(false);

  const playerIsWaiting =
    isReady && !!props.game.roundData.unconfirmedPlayerNames?.length;

  const onClick = () => {
    setIsReady(true);
    props.confirmReady();
  };

  const forVotes = props.game.roundData.votes.filter((v) => v.playerApproves);
  const againstVotes = props.game.roundData.votes.filter(
    (v) => !v.playerApproves,
  );

  const voteSucceeded = props.game.roundData.voteSucceeded;
  return (
    <Page>
      <h2>{voteSucceeded ? 'Nomination Succeeded' : 'Nomination Failed'}</h2>
      <MainContent>
        <SubTitle>Votes For:</SubTitle>
        {forVotes.length === 0 && <span>none</span>}
        {forVotes.map((vote) => (
          <PlayerResult key={`vote-${vote.id}`}>
            <span>{vote.name}:</span>
            <span>👍</span>
          </PlayerResult>
        ))}
        <SubTitle>Votes Against:</SubTitle>
        {againstVotes.map((vote) => (
          <PlayerResult key={`vote-${vote.id}`}>
            <span>{vote.name}:</span>
            <span>👎</span>
          </PlayerResult>
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
