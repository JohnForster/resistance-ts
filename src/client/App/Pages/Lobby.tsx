import React, { PureComponent, Fragment } from 'react';
import { GameData } from '../../../shared/types/gameData';
import { PlayerData } from '../../../shared/types/playerData';

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
      <Fragment>
        <h1>Lobby</h1>
        <p>Game ID: {this.props.game.gameID}</p>
        <h3>Players</h3>
        {this.props.game.players.map((p, i) => (
          <p key={`player-${i}`}>{p.name}</p>
        ))}
        <If condition={this.isHost}>
          <button onClick={this.props.beginGame} disabled={this.props.game.players.length < 2}>
            Begin Game
          </button>
        </If>
      </Fragment>
    );
  }
}
