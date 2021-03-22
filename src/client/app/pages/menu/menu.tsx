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

const OrderContainer = styled.div`
  display: 'flex';
  flex-direction: 'column';
  align-items: 'baseline';
  padding-bottom: '1rem';
`;

const Name = styled.div`
  display: 'flex';
  align-items: 'baseline';
`;

const Crown = styled.div`
  width: 0;
  padding-left: '10px';
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
          <OrderContainer>
            {props.players.map(({ name, id }, i) => (
              <Name key={`playerOrder-${id.slice(0, 6)}`}>
                {name}
                {id === props.leaderID && <Crown>{'👑'}</Crown>}
              </Name>
            ))}
          </OrderContainer>
          <CancelButton onClick={() => setCancellingGame(true)}>
            Cancel Game
          </CancelButton>
          <button onClick={handleReturn}>Return</button>
        </>
      )}
    </Page>
  );
};
