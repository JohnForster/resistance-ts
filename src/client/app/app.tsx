import React, { PureComponent, Fragment } from 'react';
import { LandingPage } from './pages';
import {
  CreateEvent,
  JoinEvent,
  PlayerDataEvent,
  MessageEvent,
  GameUpdateEvent,
  BeginGameEvent,
} from '../../shared/types/eventTypes';
import WSEventEmitter from '../helpers/wsEventEmitter';
import LobbyPage from './pages/Lobby';
import { GameData } from '../../shared/types/gameData';
import CharacterPage from './pages/Character';

interface AppState {
  game: GameData;
  status: 'idle' | 'pending' | 'inLobby' | 'inGame';
  eventEmitter?: WSEventEmitter;
  player: { name: string; playerID: string };
}
const address = process.env.DEV_SERVER || window.location.host;
const CONNECTION_URL = `ws://${address}/ws`;

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

  onGameUpdate = (data: GameUpdateEvent['data']): void => {
    // TODO set status
    this.setState({ game: data });
  };

  onPlayerUpdate = (data: PlayerDataEvent['data']): void => {
    this.setState({ player: data });
  };

  joinGame = (gameID: string): void => {
    this.state.eventEmitter.send<JoinEvent>('join_game', { gameID });
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

  beginGame = (): void => {
    this.state.eventEmitter.send<BeginGameEvent>('beginGame', {
      gameID: this.state.game.gameID,
      playerIDs: this.state.game.players.map(p => p.id),
    });
  };

  confirmCharacter = (): void => {};

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
          <When condition={this.state.game.round === 0 && this.state.game.stage === 'lobby'}>
            <LobbyPage game={this.state.game} player={this.state.player} beginGame={this.beginGame} />
          </When>
          <When condition={this.state.game.round === 0 && this.state.game.stage === 'characterAssignment'}>
            <CharacterPage game={this.state.game} confirmCharacter={this.confirmCharacter} />
          </When>
          <When condition={this.state.game.round > 0}>In Game</When>
        </Choose>
      </Fragment>
    );
  }
}
