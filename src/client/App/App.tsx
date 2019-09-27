import React, { PureComponent, Fragment } from 'react';
import { LandingPage } from './Pages';
import { CreateEvent, JoinEvent, PlayerDataEvent, MessageEvent, GameUpdateEvent } from '../../shared/types/eventTypes';
import WSEventEmitter from '../helpers/wsEventEmitter';
import LobbyPage from './Pages/Lobby';
import { GameData } from '../../shared/types/gameData';

interface AppState {
  game: GameData;
  status: 'idle' | 'pending' | 'inLobby' | 'inGame';
  eventEmitter?: WSEventEmitter;
  player: { name: string; playerID: string };
}

// ! Hard coded
const CONNECTION_URL = `ws://${window.location.host}/ws`;

export default class App extends PureComponent<{}, AppState> {
  state: AppState = {
    game: null,
    status: 'idle',
    player: { playerID: null, name: null },
  };

  componentDidMount(): void {
    const eventEmitter = new WSEventEmitter(CONNECTION_URL);

    // Temporary for message/error
    eventEmitter.bind('message', msg => console.log('message received: ', msg));
    eventEmitter.bind('error', msg => console.error('error received: ', msg));

    eventEmitter.bind('playerData', this.onPlayerUpdate);
    eventEmitter.bind('gameUpdate', this.onGameUpdate);

    this.setState({ eventEmitter });
  }

  hostGame = (): void => {
    this.state.eventEmitter.send<CreateEvent>('create_game', { hostID: this.state.player.playerID });
    this.setState({ status: 'pending' });
  };

  get isHost(): boolean {
    if (!this.state.game) return false;
    return this.state.player.playerID === this.state.game.hostID;
  }

  onGameUpdate = (data: GameUpdateEvent['data']): void => {
    // TODO set status
    this.setState({ game: data });
  };

  joinGame = (gameID: string): void => {
    this.state.eventEmitter.send<JoinEvent>('join_game', { gameID });
  };

  onPlayerUpdate = (data: PlayerDataEvent['data']): void => {
    this.setState({ player: data }, () => console.log('app state:', this.state));
  };

  testMessage = (): void => {
    this.state.eventEmitter.send<MessageEvent>('message', 'Test message');
  };

  submitName = (name: string): void => {
    this.state.eventEmitter.send<PlayerDataEvent>('playerData', {
      ...this.state.player,
      name,
    });

    const player = { ...this.state.player, name };
    this.setState({ player });
  };

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
              submitName={this.submitName}
            />
          </When>
          <When condition={this.state.game.round === 0}>
            <LobbyPage game={this.state.game} />
          </When>
          <When condition={this.state.game.round > 0}>In Game</When>
        </Choose>
      </Fragment>
    );
  }
}
