import React, { PureComponent, Fragment } from 'react';
import { LandingPage } from './Pages';
import { CreateEvent, JoinEvent, PlayerDataEvent, MessageEvent, GameUpdateEvent } from '../../shared/types/eventTypes';
import WSEventEmitter from '../helpers/wsEventEmitter';
import ClientPlayer from './clientGame/clientPlayer';
import LobbyPage from './Pages/Lobby';
import { GameData } from '../../shared/types/gameData';

interface AppState {
  game: GameData;
  status: 'idle' | 'pending' | 'inLobby' | 'inGame';
  eventEmitter?: WSEventEmitter;
  player?: ClientPlayer;
}

// ! Hard coded
const CONNECTION_URL = 'ws://192.168.1.9:8080/echo';

export default class App extends PureComponent<{}, AppState> {
  state: AppState = {
    game: null,
    status: 'idle',
  };

  componentDidMount(): void {
    const eventEmitter = new WSEventEmitter(CONNECTION_URL);

    // Temporary for message/error
    eventEmitter.bind('message', msg => console.log('message received: ', msg));
    eventEmitter.bind('error', msg => console.error('error received: ', msg));

    eventEmitter.bind('playerData', this.createPlayer);
    eventEmitter.bind('gameUpdate', this.onGameUpdate);

    this.setState({ eventEmitter });
  }

  hostGame = (): void => {
    this.state.eventEmitter.send<CreateEvent>('create_game', { hostID: this.state.player.id });
    this.setState({ status: 'pending' });
  };

  onGameUpdate = (data: GameUpdateEvent['data']): void => {
    // TODO set status
    this.setState({ game: data });
  };

  joinGame = (gameID: string): void => {
    this.state.eventEmitter.send<JoinEvent>('join_game', { gameID });
  };

  createPlayer = (data: PlayerDataEvent['data']): void => {
    const player = new ClientPlayer(data.playerID);
    this.setState({ player }, () => console.log('app state:', this.state));
  };

  testMessage = (): void => {
    this.state.eventEmitter.send<MessageEvent>('message', 'Test message');
  };

  onUpdatePlayers = (data: UpdatePlayersEvent) => {};

  render(): JSX.Element {
    return (
      <Fragment>
        <Choose>
          <When condition={!this.state.game}>
            <LandingPage
              hostGame={this.hostGame}
              joinGame={this.joinGame}
              player={this.state.player}
              testMessage={this.testMessage}
            />
          </When>
          <When condition={this.state.game.round === 0}>
            <LobbyPage game={this.state.game} />
          </When>
        </Choose>
      </Fragment>
    );
  }
}
