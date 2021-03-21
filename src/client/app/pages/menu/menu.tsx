import * as React from 'react';
import Page from '../../components/page/page';

interface Props {
  leaveGame: () => void;
  returnToGame: () => void;
}

export const Menu: React.FC<Props> = (props) => {
  const [leavingGame, setLeavingGame] = React.useState(false);

  const handleReturn = () => {
    setLeavingGame(false);
    props.returnToGame();
  };

  return (
    <Page>
      {leavingGame ? (
        <>
          <h2>Are you sure you want to leave the game?</h2>
          <h3>This will quit the game for everyone currently playing</h3>
          <button onClick={props.leaveGame}>Confirm Leave</button>
          <button onClick={handleReturn}>Return</button>
        </>
      ) : (
        <>
          <h2>Menu</h2>
          <button onClick={() => setLeavingGame(true)}>Leave Game</button>
          <button onClick={handleReturn}>Return</button>
        </>
      )}
    </Page>
  );
};
