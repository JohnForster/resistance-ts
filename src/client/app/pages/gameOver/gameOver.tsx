import * as React from 'react';
import { GameData } from 'shared';
import Page from '../../components/page/page';
import { ContinueButton } from '../../components/continueButton/continueButton';

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
          {!!result.assassinated && (
            <h3>{result.assassinated} was assassinated.</h3>
          )}
          <h2>The spies in this game were...</h2>
          {result.spies.map((name, i) => (
            <h3 key={`${name}-${i}`}>{name}</h3>
          ))}
        </>
      )}
      <ContinueButton
        text="Return to main screen"
        onClick={props.continue}
        name="returnToMainScreen"
      />
    </Page>
  );
};
