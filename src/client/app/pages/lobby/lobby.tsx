import React from 'react';

import { GameData } from '@shared/types/gameData';
import { PlayerData } from '@shared/types/playerData';
import * as Styled from './styled';
import Page from '../../components/page/page';
import { ContinueButton } from '../../components/continueButton/continueButton';

export interface LobbyPageProps {
  game: GameData<'lobby'>;
  player: PlayerData;
  beginGame: () => void;
}

export const LobbyPage: React.FC<LobbyPageProps> = (props) => (
  <Page>
    <h1>Lobby</h1>
    <p>Game ID: </p>
    <Styled.GameID id="gameID">{props.game.gameID}</Styled.GameID>
    <h3>Players</h3>
    <Styled.PlayerContainer>
      {props.game.players.map((p, i) => (
        <p key={`player-${i}`}>{p.name}</p>
      ))}
    </Styled.PlayerContainer>
    <ContinueButton
      hidden={!props.game.isHost}
      name="begingame"
      onClick={props.beginGame}
      disabled={props.game.players.length < 2}
      text="Begin Game"
      subtext={`Waiting for ${props.game.hostName} to start the game.`}
      hideSubtext={props.game.isHost}
    />
  </Page>
);
