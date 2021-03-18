import React from 'react';
import { GameData } from '@shared/types/gameData';
import Page from '../../components/page/page';
import listString from '../../helpers/listString';

interface VoteResultsProps {
  game: GameData<'votingResult'>;
  confirmReady: () => void;
}

export const VoteResultsPage: React.FC<VoteResultsProps> = (props) => {
  const [isReady, setIsReady] = React.useState(false);

  const playerIsWaiting =
    isReady && !!props.game.roundData.unconfirmedPlayerNames?.length;

  const onClick = () => {
    setIsReady(true);
    props.confirmReady();
  };

  // TODO make this less ugly
  return (
    <Page>
      <h2>Vote Results</h2>
      {props.game.roundData.votes.map((vote, i) => (
        <p key={`vote-${i}`}>
          {vote.name}: {vote.playerApproves ? '👍' : '👎'}
        </p>
      ))}
      <h3>
        {props.game.roundData.voteSucceeded
          ? 'Nomination Succeeded'
          : `Nomination failed. ${props.game.roundData.votesRemaining} nominations remain...`}
      </h3>
      <button onClick={onClick} disabled={isReady}>
        Ready
      </button>
      {playerIsWaiting && (
        <p>
          Waiting for{' '}
          {listString(props.game.roundData.unconfirmedPlayerNames, 'and')} to
          confirm...
        </p>
      )}
    </Page>
  );
};
