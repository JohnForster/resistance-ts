import React, { PureComponent } from 'react';
import Cookies from 'js-cookie';

import { DataByEventName } from '@shared/types/eventTypes';

import * as typeGuards from '../types/typeGuards';
import { GameData } from '@shared/types/gameData';

import IOEventEmitter from './helpers/IOEventEmitter';
import * as Pages from './pages';
import * as Styled from './styles/styled';

interface AppState {
  game: GameData;
  status: 'idle' | 'pending' | 'inLobby' | 'inGame';
  eventEmitter?: IOEventEmitter;
  player: { name: string; playerID: string };
  screen: Screen;
}

const APIAddress = window.location.host;

export default class App extends PureComponent<{}, AppState> {
  state: AppState = {
    game: null,
    status: 'idle',
    player: { playerID: null, name: null },
    screen: window.screen,
  };

  componentDidMount(): void {
    const eventEmitter = new IOEventEmitter(APIAddress);

    // Temporary for message/error
    eventEmitter.bind('serverMessage', this.onGameUpdate);

    // Register listeners
    eventEmitter.bind('playerData', this.onPlayerUpdate);

    window.addEventListener('resize', () => {
      this.setState({ screen: window.screen });
    });

    // Either send user data or request user data
    this.setState({ eventEmitter });
  }

  windowResize() {}

  onGameUpdate = (data: DataByEventName<'serverMessage'>): void => {
    console.log('gameUpdateReceived. data:', data);
    this.setState({ game: data });
  };

  onPlayerUpdate = (data: DataByEventName<'playerData'>): void => {
    // Use a library for dealing with cookies?
    console.log(`Setting player cookie: ${data.playerID.slice(0, 6)}...`);
    Cookies.set('playerID', data.playerID);
    this.setState({ player: data });
  };

  hostGame = (): void => {
    this.state.eventEmitter.send('createGame', {
      hostID: this.state.player.playerID,
    });
    this.setState({ status: 'pending' });
  };

  joinGame = (gameID: string): void => {
    this.state.eventEmitter.send('joinGame', { gameID });
  };

  // ! Currently using same type for incoming and outgoing playerData
  submitName = (name: string): void => {
    const player = { ...this.state.player, name };
    this.state.eventEmitter.send('playerData', player);
    this.setState({ player });
  };

  beginGame = (): void => {
    const { gameID, playerID } = this.state.game;
    this.state.eventEmitter.sendMessage({
      gameID,
      playerID,
      type: 'startGame',
    });
  };

  submitNominations = (playerIDs: Set<string>): void => {
    const { gameID, playerID } = this.state.game;
    this.state.eventEmitter.sendMessage({
      type: 'nominatePlayers',
      gameID,
      playerID,
      nominatedPlayerIDs: Array.from(playerIDs),
    });
  };

  submitVote = (playerApproves: boolean): void => {
    const { gameID, playerID } = this.state.game;
    this.state.eventEmitter.sendMessage({
      type: 'vote',
      gameID,
      playerID,
      playerApproves,
    });
  };

  submitMissionChoice = (succeedMission: boolean): void => {
    const { gameID, playerID } = this.state.game;
    this.state.eventEmitter.sendMessage({
      type: 'mission',
      gameID,
      playerID,
      succeedMission,
    });
  };

  continue = (): void => {
    const { gameID, playerID } = this.state.game;
    this.state.eventEmitter.sendMessage({
      type: 'continue',
      gameID,
      playerID,
      confirm: true,
    });
  };

  render(): JSX.Element {
    return (
      <>
        <Styled.Global />
        <Styled.AppContainer screen={this.state.screen}>
          <Styled.BackgroundImage
            screen={this.state.screen}
            src="assets/bg.jpg"
            alt=""
          />
          {process.env.NODE_ENV === 'development' && (
            <p style={{ fontSize: '8px', position: 'absolute' }}>
              {this.state.player?.name}
            </p>
          )}
          {!this.state.game ? (
            <Pages.LandingPage
              hostGame={this.hostGame}
              joinGame={this.joinGame}
              player={this.state.player}
              submitName={this.submitName}
            />
          ) : typeGuards.isLobbyRound(this.state.game) ? (
            <Pages.LobbyPage
              game={this.state.game as GameData<'lobby'>}
              player={this.state.player}
              beginGame={this.beginGame}
            />
          ) : typeGuards.isCharacterRound(this.state.game) ? (
            <Pages.CharacterPage
              game={this.state.game as GameData<'character'>}
              confirmCharacter={this.continue}
            />
          ) : typeGuards.isNominationRound(this.state.game) ? (
            <Pages.NominationPage
              game={this.state.game as GameData<'nomination'>}
              submitNominations={this.submitNominations}
            />
          ) : typeGuards.isVotingRound(this.state.game) ? (
            <Pages.VotingPage
              game={this.state.game as GameData<'voting'>}
              submitVote={this.submitVote}
            />
          ) : typeGuards.isVotingResultRound(this.state.game) ? (
            <Pages.VoteResultsPage
              game={this.state.game as GameData<'votingResult'>}
              confirmReady={this.continue}
            />
          ) : typeGuards.isMissionRound(this.state.game) ? (
            <Pages.MissionPage
              game={this.state.game as GameData<'mission'>}
              completeMission={this.submitMissionChoice}
            />
          ) : typeGuards.isMissionResultRound(this.state.game) ? (
            <Pages.MissionResultPage
              game={this.state.game as GameData<'missionResult'>}
              confirmReady={this.continue}
            />
          ) : (
            <></>
          )}
        </Styled.AppContainer>
      </>
    );
  }
}
