import React, { PureComponent, Fragment } from 'react';
import ClientGame from '../clientGame/clientGame';

export interface LobbyPageProps {
  game: ClientGame;
}

interface LobbyPageState {}

export default class LobbyPage extends PureComponent<LobbyPageProps, LobbyPageState> {
  render(): JSX.Element {
    return (
      <Fragment>
        <h1>Lobby</h1>
        <p>Game ID: {this.props.game.id}</p>
        <h3>Players</h3>
        {this.props.game.players.map((p, i) => (
          <p key={`player-${i}`}>{p.name}</p>
        ))}
      </Fragment>
    );
  }
}
