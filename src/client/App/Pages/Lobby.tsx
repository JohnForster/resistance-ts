import React, { PureComponent, Fragment } from 'react';
import { GameData } from '../../../shared/types/gameData';

export interface LobbyPageProps {
  game: GameData;
}

interface LobbyPageState {}

export default class LobbyPage extends PureComponent<LobbyPageProps, LobbyPageState> {
  render(): JSX.Element {
    return (
      <Fragment>
        <h1>Lobby</h1>
        <p>Game ID: {this.props.game.gameID}</p>
        <h3>Players</h3>
        {this.props.game.players.map((p, i) => (
          <p key={`player-${i}`}>{p.name}</p>
        ))}
      </Fragment>
    );
  }
}
