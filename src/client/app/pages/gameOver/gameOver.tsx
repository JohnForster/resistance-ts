import * as React from 'react';
import { GameData } from '@shared/types/gameData';
import Page from '../../components/page/page';

interface Props {
  game: GameData<'gameOver'>;
  continue: () => void;
}

export const GameOverPage: React.FC<Props> = (props) => {
  // TODO Make GameOver page better
  const result = props.game.roundData;
  const allegiance = props.game.secretData.allegiance;

  return (
    <Page>
      {result.reason === 'cancelled' ? (
        <>
          <h1>Game Cancelled by {result.cancelledBy}</h1>
          <h2>Thank you for playing</h2>
        </>
      ) : (
        <>
          <h1>{allegiance === result.winners ? 'Victory' : 'Defeat'}</h1>
          <h2>The spies in this game were...</h2>
          {result.spies.map((name, i) => (
            <h3 key={`${name}-${i}`}>{name}</h3>
          ))}
        </>
      )}
      <button onClick={props.continue} name="returnToMainScreen">
        Return to main screen
      </button>
    </Page>
  );
};
