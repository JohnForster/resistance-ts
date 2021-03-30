import * as React from 'react';
import capitalize from 'lodash/capitalize';

import { GameData } from 'shared';

import styled, { ThemeContext } from '../../styles/themed-styled-components';
import { ThemeName } from '../../themes';

import Page from '../../components/page/page';
import { CharacterInfo } from '../../components/characterInfo/characterInfo';
import { ContinueButton } from '../../components/continueButton/continueButton';

import { PlayOrder } from './components/playOrder';
import { HistoryScreen } from './components/history';
import { RulesScreen } from './components/rules';
interface Props {
  cancelGame: () => void;
  returnToGame: () => void;
  game: GameData;
  setTheme: (themeName: ThemeName) => void;
  // characterInfo: CharacterInformation;
  // missionNumber: number;
  // players: GameData['players'];
  // leaderID: string;
}

const CancelButton = styled.button`
  margin-bottom: 15px;
  color: red;
`;

const BottomButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  justify-content: flex-end;
  flex-grow: 1;
`;

const MenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  align-items: center;
  & > button {
    margin-top: 10px;
  }
`;

type MenuScreen =
  | 'menu'
  | 'playOrder'
  | 'history'
  | 'rules'
  | 'character'
  | 'cancelling';

// TODO - Add more options. E.g. Name change (when out of game), about etc.
export const Menu: React.FC<Props> = ({
  cancelGame,
  returnToGame,
  setTheme,
  game,
}) => {
  const [menuScreen, setMenuScreen] = React.useState<MenuScreen>('menu');
  const theme = React.useContext(ThemeContext);

  const handleReturn = () => {
    returnToGame();
  };

  const handleMenuChange = (screen: MenuScreen) => () => setMenuScreen(screen);

  return (
    <Page>
      {menuScreen === 'menu' ? (
        <MenuContainer>
          <h2>Menu</h2>
          {game.characterInfo && game.missionNumber > 0 && (
            <>
              <button onClick={handleMenuChange('character')}>Character</button>
              <button onClick={handleMenuChange('history')}>Missions</button>
              <button onClick={handleMenuChange('playOrder')}>
                Play Order
              </button>
            </>
          )}
          <button onClick={handleMenuChange('rules')}>Rules</button>
          <button
            onClick={() =>
              setTheme(theme.name === 'resistance' ? 'avalon' : 'resistance')
            }
          >
            Theme: {capitalize(theme.name)}
          </button>
          <BottomButtonsContainer>
            <CancelButton onClick={handleMenuChange('cancelling')}>
              Cancel Game
            </CancelButton>
            <button onClick={handleReturn}>Return to Game</button>
          </BottomButtonsContainer>
        </MenuContainer>
      ) : menuScreen === 'cancelling' ? (
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
        <PlayOrder players={game.players} leaderID={game.leaderID} />
      ) : menuScreen === 'rules' ? (
        <RulesScreen />
      ) : menuScreen === 'history' ? (
        <HistoryScreen history={game.history} />
      ) : (
        <></>
      )}
      {menuScreen !== 'menu' && menuScreen !== 'cancelling' && (
        <ContinueButton
          text={'Return to menu'}
          onClick={() => setMenuScreen('menu')}
        />
      )}
    </Page>
  );
};
