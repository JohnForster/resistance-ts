import { GameData } from '@shared/types/gameData';
import * as React from 'react';
import styled from 'styled-components';
import Page from '../../components/page/page';

interface Props {
  cancelGame: () => void;
  returnToGame: () => void;
  players: GameData['players'];
  leaderID: string;
}

const CancelButton = styled.button`
  color: red;
`;
// TODO - Add more options. E.g. Name change (when out of game), about etc.
export const Menu: React.FC<Props> = (props) => {
  const [cancellingGame, setCancellingGame] = React.useState(false);

  const handleReturn = () => {
    setCancellingGame(false);
    props.returnToGame();
  };

  return (
    <Page>
      {cancellingGame ? (
        <>
          <h2>Are you sure you want to cancel the game?</h2>
          <h3>
            This will cancel the game for{' '}
            <span style={{ textDecoration: 'underline' }}>all players</span>{' '}
          </h3>
          <CancelButton onClick={props.cancelGame}>Confirm Cancel</CancelButton>
          <button onClick={handleReturn}>Return</button>
        </>
      ) : (
        <>
          <h2>Menu</h2>
          <h3>Play Order:</h3>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'baseline',
              paddingBottom: '1rem',
            }}
          >
            {props.players.map(({ name, id }, i) => (
              // TODO Fix this once public/private IDs are implemented, this
              // TODO   will glitch if there are two people with the same name.
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                }}
              >
                {name}
                {id === props.leaderID && (
                  <div style={{ width: 0, paddingLeft: '10px' }}>{'👑'}</div>
                )}
              </div>
            ))}
          </div>
          <CancelButton onClick={() => setCancellingGame(true)}>
            Cancel Game
          </CancelButton>
          <button onClick={handleReturn}>Return</button>
        </>
      )}
    </Page>
  );
};
