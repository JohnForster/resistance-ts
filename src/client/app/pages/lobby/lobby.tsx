import React from 'react';
import { GameData } from '@shared/types/gameData';
import { PlayerData } from '@shared/types/playerData';
import * as Styled from './styled';
import Page from '../../components/page/page';

export interface LobbyPageProps {
  game: GameData;
  player: PlayerData;
  beginGame: () => void;
}

interface LobbyPageState {}

export const LobbyPage: React.FC<LobbyPageProps> = props => (
  <Page>
    <h1>Lobby</h1>
    <p>Game ID: </p>
    <Styled.GameID>{props.game.gameID}</Styled.GameID>
    <h3>Players</h3>
    <Styled.PlayerContainer>
      {props.game.players.map((p, i) => (
        <p key={`player-${i}`}>{p.name}</p>
      ))}
    </Styled.PlayerContainer>
    <Choose>
      <When condition={props.game.isHost}>
        <button onClick={props.beginGame} disabled={props.game.players.length < 2}>
          Begin Game
        </button>
      </When>
      <When condition={!props.game.isHost}>
        <p>
          Waiting for <span>{props.game.hostName}</span> to start the game.
        </p>
      </When>
    </Choose>
  </Page>
);
