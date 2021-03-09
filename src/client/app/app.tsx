import React, { PureComponent } from 'react';
import Cookies from 'js-cookie';

import { DataByEventName } from '@shared/types/eventTypes';

import * as typeGuards from '../types/typeGuards';
import { GameData } from '@shared/types/gameData';

import IOEventEmitter from './helpers/IoEventEmitter';
import * as Pages from './pages';
import * as Styled from './styles/styled';

interface AppState {
  game: GameData;
  status: 'idle' | 'pending' | 'inLobby' | 'inGame';
  eventEmitter?: IOEventEmitter;
  player: { name: string; playerID: string };
}

const APIAddress = process.env.DEV_API_ADDRESS || window.location.host;

export default class App extends PureComponent<{}, AppState> {
  state: AppState = {
    game: null,
    status: 'idle',
    player: { playerID: null, name: null },
  };

  componentDidMount(): void {
    const eventEmitter = new IOEventEmitter(APIAddress);

    // Temporary for message/error
    eventEmitter.bind('serverMessage', this.onGameUpdate);

    // Register listeners
    eventEmitter.bind('playerData', this.onPlayerUpdate);

    // Either send user data or request user data
    this.setState({ eventEmitter });
  }

  hostGame = (): void => {
    this.state.eventEmitter.send('createGame', {
      hostID: this.state.player.playerID,
    });
    this.setState({ status: 'pending' });
  };

  onGameUpdate = (data: DataByEventName<'serverMessage'>): void => {
    this.setState({ game: data });
  };

  onPlayerUpdate = (data: DataByEventName<'playerData'>): void => {
    // Use a library for dealing with cookies?
    console.log(`Setting player cookie: ${data.playerID.slice(0, 6)}...`);
    Cookies.set('playerID', data.playerID);
    this.setState({ player: data });
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
    const gameID = this.state.game.gameID;
    this.state.eventEmitter.send('clientMessage', {
      gameID,
      type: 'startGame',
      playerID: this.state.player.playerID,
    });
  };

  confirmCharacter = (): void => {
    const { gameID, playerID } = this.state.game;
    this.state.eventEmitter.send('clientMessage', {
      type: 'confirmCharacter',
      gameID,
      playerID,
      confirm: true,
    });
  };

  submitNominations = (playerIDs: Set<string>): void => {
    const { gameID } = this.state.game;
    this.state.eventEmitter.sendMessage({
      type: 'nominatePlayers',
      gameID,
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
      type: 'confirmVoteResult',
      gameID,
      playerID,
      confirm: true,
    });
  };

  typeGuard = (game: GameData): game is GameData<'voting'> => {
    return true;
  };

  render(): JSX.Element {
    return (
      <>
        <Styled.Global />
        <Styled.AppContainer>
          <Styled.BackgroundImage src="assets/bg.jpg" alt="" />
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
              confirmCharacter={this.confirmCharacter}
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
