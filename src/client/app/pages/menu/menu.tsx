import { CharacterInformation, GameData, RoundName } from 'shared';
import * as React from 'react';
import styled from 'styled-components';
import Page from '../../components/page/page';
import { PlayOrder } from './components/playOrder';
import { CharacterInfo } from '../../components/characterInfo/characterInfo';

interface Props {
  cancelGame: () => void;
  returnToGame: () => void;
  game: GameData;
  // characterInfo: CharacterInformation;
  // missionNumber: number;
  // players: GameData['players'];
  // leaderID: string;
}

const CancelButton = styled.button`
  color: red;
`;

const BottomButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: flex-end;
  flex-grow: 1;
`;

type MenuScreen = 'menu' | 'playOrder' | 'rules' | 'character' | 'cancelling';

// TODO - Add more options. E.g. Name change (when out of game), about etc.
export const Menu: React.FC<Props> = ({ cancelGame, returnToGame, game }) => {
  const [menuScreen, setMenuScreen] = React.useState<MenuScreen>('menu');

  const handleReturn = () => {
    returnToGame();
  };

  const handleMenuChange = (screen: MenuScreen) => () => setMenuScreen(screen);

  const backToMenu = () => setMenuScreen('menu');

  return (
    <Page>
      {menuScreen === 'cancelling' ? (
        <>
          <h2>Are you sure you want to cancel the game?</h2>
          <h3>
            This will cancel the game for{' '}
            <span style={{ textDecoration: 'underline' }}>all players</span>{' '}
          </h3>
          <CancelButton onClick={cancelGame}>Confirm Cancel</CancelButton>
          <button onClick={handleReturn}>Return</button>
        </>
      ) : menuScreen === 'character' ? (
        game.characterInfo && (
          <CharacterInfo
            info={game.characterInfo}
            characters={game.characters}
          />
        )
      ) : menuScreen === 'playOrder' ? (
        <PlayOrder
          players={game.players}
          leaderID={game.leaderID}
          backToMenu={backToMenu}
        />
      ) : menuScreen === 'rules' ? (
        <></>
      ) : (
        <>
          <h2>Menu</h2>
          <button onClick={handleMenuChange('rules')}>Rules</button>
          {game.characterInfo && game.missionNumber > 0 && (
            <>
              <button onClick={handleMenuChange('playOrder')}>
                Play Order
              </button>
              <button onClick={handleMenuChange('character')}>Character</button>
            </>
          )}
          <BottomButtonsContainer>
            <CancelButton onClick={handleMenuChange('cancelling')}>
              Cancel Game
            </CancelButton>
            <button onClick={handleReturn}>Return</button>
          </BottomButtonsContainer>
        </>
      )}
    </Page>
  );
};
