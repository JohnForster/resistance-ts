import React, { PureComponent } from 'react';
import Cookies from 'js-cookie';
import _isMobile from 'ismobilejs';

import { DataByEventName } from 'shared';

import * as typeGuards from '../types/typeGuards';
import { Character, GameData } from 'shared';

import IOEventEmitter from './helpers/IOEventEmitter';
import * as Pages from './pages';
import * as Styled from './styles/styled';
import { MenuButton } from './components/menuButton/MenuButton';
import { themes } from './themes';
import { ThemeProvider } from './styles/themed-styled-components';

const isMobile = _isMobile();

interface AppState {
  game: GameData;
  eventEmitter?: IOEventEmitter;
  player: { name: string; playerID: string };
  screenSize: { width: number; height: number };
  menuIsOpen: boolean;
  connected: boolean;
  theme: 'avalon' | 'resistance';
  characters: { [key in Exclude<Character, 'Assassin'>]?: boolean };
}

const defaultCharacters: { [key in Exclude<Character, 'Assassin'>]: false } = {
  Merlin: false,
  Percival: false,
  Morgana: false,
  Mordred: false,
  Oberon: false,
};

const APIAddress = window.location.host;

const getScreenSize = () => {
  const height = isMobile.phone ? window.screen.height : window.innerHeight;
  const width = isMobile.phone ? window.screen.width : window.innerWidth;
  return { height, width };
};

export default class App extends PureComponent<{}, AppState> {
  state: AppState = {
    game: null,
    player: { playerID: null, name: null },
    screenSize: getScreenSize(),
    eventEmitter: new IOEventEmitter(APIAddress),
    menuIsOpen: false,
    connected: true,
    theme: 'avalon',
    characters: {},
  };

  componentDidMount(): void {
    // Temporary for message/error
    this.state.eventEmitter.bind('gameUpdateMessage', this.onGameUpdate);

    this.state.eventEmitter.bind('returnToMainScreen', this.returnToMain);

    this.state.eventEmitter.socket.on('disconnect', () => {
      this.setState({ connected: false });
    });

    this.state.eventEmitter.socket.onAny(() => {
      if (!this.state.connected) {
        this.setState({ connected: true });
      }
    });

    // Register listeners
    this.state.eventEmitter.bind('playerData', this.onPlayerUpdate);

    window.addEventListener('resize', () => {
      console.log('resizing...');
      window.innerHeight;
      this.setState({
        screenSize: getScreenSize(),
      });
    });
  }

  onGameUpdate = (data: DataByEventName<'gameUpdateMessage'>): void => {
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
  };

  joinGame = (gameID: string): void => {
    this.state.eventEmitter.send('joinGame', { gameID });
  };

  returnToMain = () => {
    this.setState({ game: null });
  };

  // ! Currently using same type for incoming and outgoing playerData
  submitName = (name: string): void => {
    const player = { ...this.state.player, name };
    this.state.eventEmitter.send('playerData', player);
    this.setState({ player });
  };

  beginGame = (
    characters: Record<Exclude<Character, 'Assassin'>, boolean>,
  ): void => {
    const { gameID, playerID } = this.state.game;

    this.state.eventEmitter.sendMessage({
      gameID,
      playerID,
      characters: {
        ...defaultCharacters,
        ...characters,
      },
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

  cancelGame = () => {
    this.state.eventEmitter.send('cancelGame', {
      playerID: this.state.player.playerID,
    });
    this.setState({ menuIsOpen: false });
  };

  get theme() {
    return themes[this.state.theme];
  }

  render(): JSX.Element {
    return (
      <ThemeProvider theme={this.theme}>
        <Styled.Global />
        <Styled.AppContainer>
          <Styled.BackgroundImage
            screenSize={this.state.screenSize}
            src={this.theme.background.path}
            alt=""
          />
          {!!this.state.game && (
            <MenuButton
              checked={this.state.menuIsOpen}
              onClick={() =>
                this.setState({ menuIsOpen: !this.state.menuIsOpen })
              }
            />
          )}
          {process.env.NODE_ENV === 'development' && (
            <>
              <button
                style={{ width: '15px', height: '15px', position: 'absolute' }}
                onClick={() =>
                  this.setState({
                    theme:
                      this.state.theme === 'avalon' ? 'resistance' : 'avalon',
                  })
                }
              >
                -
              </button>
              <p style={{ fontSize: '8px', position: 'absolute' }}>
                {this.state.player?.name}
              </p>
            </>
          )}
          {/* TODO: Add connecting indicator */}

          {this.state.menuIsOpen ? (
            <Pages.Menu
              returnToGame={() => this.setState({ menuIsOpen: false })}
              cancelGame={this.cancelGame}
              game={this.state.game}
            />
          ) : !this.state.connected ? (
            <Styled.LoadingContainer>
              <h1>Reconnecting...</h1>
            </Styled.LoadingContainer>
          ) : !this.state.game ? (
            <Pages.LandingPage
              hostGame={this.hostGame}
              joinGame={this.joinGame}
              player={this.state.player}
              submitName={this.submitName}
            />
          ) : typeGuards.isLobbyRound(this.state.game) ? (
            <Pages.LobbyPage
              game={this.state.game}
              beginGame={this.beginGame}
            />
          ) : typeGuards.isCharacterRound(this.state.game) ? (
            <Pages.CharacterPage
              game={this.state.game}
              confirmCharacter={this.continue}
            />
          ) : typeGuards.isNominationRound(this.state.game) ? (
            <Pages.NominationPage
              game={this.state.game}
              submitNominations={this.submitNominations}
            />
          ) : typeGuards.isVotingRound(this.state.game) ? (
            <Pages.VotingPage
              game={this.state.game}
              submitVote={this.submitVote}
            />
          ) : typeGuards.isVotingResultRound(this.state.game) ? (
            <Pages.VoteResultsPage
              game={this.state.game}
              confirmReady={this.continue}
            />
          ) : typeGuards.isMissionRound(this.state.game) ? (
            <Pages.MissionPage
              game={this.state.game}
              completeMission={this.submitMissionChoice}
            />
          ) : typeGuards.isMissionResultRound(this.state.game) ? (
            <Pages.MissionResultPage
              game={this.state.game}
              confirmReady={this.continue}
            />
          ) : typeGuards.isGameOverRound(this.state.game) ? (
            <Pages.GameOverPage
              game={this.state.game}
              continue={this.continue}
            ></Pages.GameOverPage>
          ) : (
            <></>
          )}
        </Styled.AppContainer>
      </ThemeProvider>
    );
  }
}
