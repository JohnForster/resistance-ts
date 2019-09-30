import React, { PureComponent } from 'react';
import { GameData } from '../../../../shared/types/gameData';
import { PlayerData } from '../../../../shared/types/playerData';
import * as Styled from './styled';
import Page from '../../components/page';

export interface LobbyPageProps {
  game: GameData;
  player: PlayerData;
  beginGame: () => void;
}

interface LobbyPageState {}

export default class LobbyPage extends PureComponent<LobbyPageProps, LobbyPageState> {
  get isHost(): boolean {
    return this.props.player.playerID === this.props.game.hostID;
  }

  render(): JSX.Element {
    return (
      <Page>
        <h1>Lobby</h1>
        <p>Game ID: </p>
        <Styled.GameID>{this.props.game.gameID}</Styled.GameID>

        <h3>Players</h3>
        <Styled.PlayerContainer>
          {this.props.game.players.map((p, i) => (
            <p key={`player-${i}`}>{p.name}</p>
          ))}
        </Styled.PlayerContainer>
        <If condition={this.isHost}>
          <button onClick={this.props.beginGame} disabled={this.props.game.players.length < 2}>
            Begin Game
          </button>
        </If>
      </Page>
    );
  }
}
