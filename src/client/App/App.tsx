import React, { PureComponent, Fragment } from 'react';
import { LandingPage } from './Pages';
import {
  GameCreatedEvent,
  CreateEvent,
  JoinEvent,
  GameJoinedEvent,
  NewPlayerEvent,
} from '../../shared/types/eventTypes';
import ClientGame from './clientGame/clientGame';
import WSEventEmitter from '../helpers/wsEventEmitter';
import ClientPlayer from './clientGame/clientPlayer';
import LobbyPage from './Pages/Lobby';

interface AppState {
  game: ClientGame;
  status: 'idle' | 'pending' | 'inLobby' | 'inGame';
  eventEmitter?: WSEventEmitter;
  player?: ClientPlayer;
}

export default class App extends PureComponent<{}, AppState> {
  state: AppState = {
    game: null,
    status: 'idle',
  };

  componentDidMount(): void {
    const eventEmitter = new WSEventEmitter('ws://localhost:8080/echo');

    // Temporary for message/error
    eventEmitter.bind('message', msg => console.log('message received: ', msg));
    eventEmitter.bind('error', msg => console.error('error received: ', msg));

    eventEmitter.bind('new_player', this.createPlayer);
    eventEmitter.bind('game_created', this.onGameCreated);
    eventEmitter.bind('game_joined', this.onGameJoined);

    this.setState({ eventEmitter });
  }

  hostGame = (): void => {
    this.state.eventEmitter.send<CreateEvent>('create_game', { hostID: this.state.player.id });
    this.setState({ status: 'pending' });
  };

  onGameCreated = (data: GameCreatedEvent['data']): void => {
    const game = new ClientGame({ id: data.gameID, isHosting: true, player: this.state.player });
    this.setState({ game });
  };

  joinGame = (id: string): void => {
    this.state.eventEmitter.send<JoinEvent>('join_game', { gameID: id });
  };

  onGameJoined = (data: GameJoinedEvent['data']): void => {
    const game = new ClientGame({ id: data.gameID, isHosting: false, player: this.state.player });
    this.setState({ game });
  };

  createPlayer = (data: NewPlayerEvent['data']): void => {
    const player = new ClientPlayer(data.playerID);
    this.setState({ player }, () => console.log('app state:', this.state));
  };

  render(): JSX.Element {
    return (
      <Fragment>
        {!this.state.game && (
          <LandingPage hostGame={this.hostGame} joinGame={this.joinGame} player={this.state.player} />
        )}
        {this.state.game && !this.state.game.hasStarted && <LobbyPage game={this.state.game} />}
      </Fragment>
    );
  }
}
