import React, { PureComponent, Fragment } from 'react';
import { LandingPage } from './pages';
import {
  CreateEvent,
  JoinEvent,
  PlayerDataEvent,
  MessageEvent,
  GameUpdateEvent,
  BeginGameEvent,
  ConfirmEvent,
} from '../../shared/types/eventTypes';
import WSEventEmitter from '../helpers/wsEventEmitter';
import LobbyPage from './pages/lobby/lobby';
import { GameData } from '../../shared/types/gameData';
import CharacterPage from './pages/character/character';
import * as Styled from './styles/styled';
import { GameID } from './pages/lobby/styled';

interface AppState {
  game: GameData;
  status: 'idle' | 'pending' | 'inLobby' | 'inGame';
  eventEmitter?: WSEventEmitter;
  player: { name: string; playerID: string };
}

export default class App extends PureComponent<{}, AppState> {
  state: AppState = {
    game: null,
    status: 'idle',
    player: { playerID: null, name: null },
  };

  get connectionURL(): string {
    const APIAddress = process.env.DEV_API_ADDRESS || window.location.host;
    return `ws://${APIAddress}/ws`;
  }

  componentDidMount(): void {
    const eventEmitter = new WSEventEmitter(this.connectionURL);

    // Temporary for message/error
    eventEmitter.bind('message', msg => console.log('message received: ', msg));
    eventEmitter.bind('error', msg => console.error('error received: ', msg));

    eventEmitter.bind('playerData', this.onPlayerUpdate);
    eventEmitter.bind('gameUpdate', this.onGameUpdate);
    // ? eventEmitter.open() after bindings?

    // Either send user data or request user data
    this.setState({ eventEmitter });
  }

  hostGame = (): void => {
    this.state.eventEmitter.send<CreateEvent>('create_game', { hostID: this.state.player.playerID });
    this.setState({ status: 'pending' });
  };

  onGameUpdate = (data: GameUpdateEvent['data']): void => {
    this.setState({ game: data });
  };

  onPlayerUpdate = (data: PlayerDataEvent['data']): void => {
    // Use a library for dealing with cookies?
    document.cookie = `playerID=${data.playerID}`;
    this.setState({ player: data });
  };

  joinGame = (gameID: string): void => {
    this.state.eventEmitter.send<JoinEvent>('join_game', { gameID });
  };

  testMessage = (): void => {
    this.state.eventEmitter.send<MessageEvent>('message', 'Test message');
  };

  submitName = (name: string): void => {
    const player = { ...this.state.player, name };
    this.state.eventEmitter.send<PlayerDataEvent>('playerData', player);
    this.setState({ player });
  };

  beginGame = (): void => {
    const gameID = this.state.game.gameID;
    this.state.eventEmitter.send<BeginGameEvent>('beginGame', { gameID });
  };

  confirmCharacter = (): void => {
    const { gameID, playerID } = this.state.game;
    this.state.eventEmitter.send<ConfirmEvent>('confirm', { gameID, playerID });
  };

  render(): JSX.Element {
    return (
      <Styled.AppContainer>
        <Styled.Global />
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
      </Styled.AppContainer>
    );
  }
}
