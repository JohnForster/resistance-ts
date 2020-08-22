import React, { PureComponent } from 'react';
import { LandingPage, CharacterPage, NominationPage, VotingPage, MissionPage } from './pages';
import { EventByName } from '@shared/types/eventTypes';
import { EventType } from '@client/types/event';
import WSEventEmitter from './helpers/wsEventEmitter';
import LobbyPage from './pages/lobby/lobby';
import { GameData } from '@shared/types/gameData';

import * as Styled from './styles/styled';
import MissionResultPage from './pages/missionResult/missionResult';
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
    return `wss://${APIAddress}/ws`;
  }

  componentDidMount(): void {
    const eventEmitter = new WSEventEmitter(this.connectionURL);

    // Temporary for message/error
    eventEmitter.bind(EventType.message, msg => console.log('message received: ', msg));
    eventEmitter.bind(EventType.error, msg => console.error('error received: ', msg));

    // Register listeners
    eventEmitter.bind(EventType.playerData, this.onPlayerUpdate);
    eventEmitter.bind(EventType.gameUpdate, this.onGameUpdate);
    // ? eventEmitter.open() after bindings?

    // Either send user data or request user data
    this.setState({ eventEmitter });
  }

  hostGame = (): void => {
    this.state.eventEmitter.send<typeof EventType.createGame>(EventType.createGame, {
      hostID: this.state.player.playerID,
    });
    this.setState({ status: 'pending' });
  };

  onGameUpdate = (data: EventByName<typeof EventType.gameUpdate>['data']): void => {
    this.setState({ game: data });
  };

  onPlayerUpdate = (data: EventByName<typeof EventType.playerData>['data']): void => {
    // Use a library for dealing with cookies?
    console.log(`Setting player cookie: ${data.playerID.slice(0, 6)}...`);
    document.cookie = `playerID=${data.playerID}`;
    this.setState({ player: data });
  };

  joinGame = (gameID: string): void => {
    this.state.eventEmitter.send<typeof EventType.joinGame>(EventType.joinGame, { gameID });
  };

  testMessage = (): void => {
    this.state.eventEmitter.send<typeof EventType.message>(EventType.message, 'Test message');
  };

  submitName = (name: string): void => {
    const player = { ...this.state.player, name };
    this.state.eventEmitter.send<typeof EventType.playerData>(EventType.playerData, player);
    this.setState({ player });
  };

  beginGame = (): void => {
    const gameID = this.state.game.gameID;
    this.state.eventEmitter.send<typeof EventType.beginGame>(EventType.beginGame, { gameID });
  };

  confirmCharacter = (): void => {
    const { gameID, playerID } = this.state.game;
    this.state.eventEmitter.send<typeof EventType.confirm>(EventType.confirm, { gameID, playerID });
  };

  submitNominations = (playerIDs: Set<string>): void => {
    const { gameID, playerID } = this.state.game;
    this.state.eventEmitter.send<typeof EventType.nominate>(EventType.nominate, {
      gameID,
      playerID,
      nominatedPlayerIDs: Array.from(playerIDs),
    });
  };

  submitVote = (playerApproves: boolean): void => {
    const { gameID, playerID } = this.state.game;
    this.state.eventEmitter.send<typeof EventType.vote>(EventType.vote, {
      gameID,
      playerID,
      playerApproves,
    });
  };

  submitMissionChoice = (playerVotedToSucceed: boolean): void => {
    const { gameID, playerID } = this.state.game;
    this.state.eventEmitter.send<typeof EventType.mission>(EventType.mission, {
      gameID,
      playerID,
      playerVotedToSucceed,
    });
  };

  missionResultConfirmReady = (): void => {
    const { gameID, playerID } = this.state.game;
    console.log(EventType.continue);
    this.state.eventEmitter.send<typeof EventType.continue>(EventType.continue, { gameID, playerID });
  };

  render(): JSX.Element {
    return (
      <>
        <Styled.Global />
        <Styled.AppContainer>
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
            <When condition={this.state.game.missionNumber === 0 && this.state.game.stage === 'lobby'}>
              <LobbyPage game={this.state.game} player={this.state.player} beginGame={this.beginGame} />
            </When>
            <When condition={this.state.game.missionNumber === 0 && this.state.game.stage === 'characterAssignment'}>
              <CharacterPage game={this.state.game} confirmCharacter={this.confirmCharacter} />
            </When>
            <When condition={this.state.game.missionNumber > 0 && this.state.game.stage === 'nomination'}>
              <NominationPage game={this.state.game} submitNominations={this.submitNominations} />
            </When>
            <When condition={this.state.game.missionNumber > 0 && this.state.game.stage === 'voting'}>
              <VotingPage game={this.state.game} submitVote={this.submitVote} />
            </When>
            <When condition={this.state.game.missionNumber > 0 && this.state.game.stage === 'mission'}>
              <MissionPage game={this.state.game} completeMission={this.submitMissionChoice} />
            </When>
            <When condition={this.state.game.missionNumber > 0 && this.state.game.stage === 'missionResult'}>
              <MissionResultPage game={this.state.game} confirmReady={this.missionResultConfirmReady} />
            </When>
          </Choose>
        </Styled.AppContainer>
      </>
    );
  }
}
