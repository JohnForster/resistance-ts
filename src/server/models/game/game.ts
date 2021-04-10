import chalk from 'chalk';

import {
  EventByName,
  Character,
  GameHistory,
  OngoingMission,
  PlayerId,
  RoundName,
  Message,
} from 'shared';
import { Rules, RULES } from '../../data/gameRules';

import generateID from '../../utils/generateID';
import { getHsl } from '../../utils/getHsl';
import { getClientHistory } from '../../utils/getClientHistory';
import { getCharacterInfo } from '../../utils/getCharacterInfo';
import { storage } from '../../storage/storage';

import { getUser, send, updateUser, User } from '../user';

import { GameOverRound, LobbyRound, Round } from './rounds';
import { rounds } from './config';

export interface Player {
  inGame: boolean;
  userID: PlayerId;
  allegiance?: 'resistance' | 'spies';
  character?: Character;
}

export type GameResult =
  | {
      type: 'completed';
      winners: 'spies' | 'resistance';
      gameOverReason: 'nominations' | 'missions' | 'assassination';
    }
  | {
      type: 'cancelled';
      cancelledBy: PlayerId;
    }
  | { type: 'ongoing' };

export class Game {
  readonly id: string = generateID();
  readonly colouredId: string;
  public players: Player[] = [];

  public currentMission: OngoingMission;
  public history: GameHistory = {};
  public hostId: string;
  public result: GameResult = { type: 'ongoing' };
  public characters: { [key in Character]: boolean } = {
    Merlin: false,
    Assassin: false,
    Percival: false,
    Morgana: false,
    Mordred: false,
    Oberon: false,
  };
  public assassinatedPlayerID: string;

  private currentRound: Round<RoundName>;
  private leaderIndex = 0;

  public get host(): User {
    return getUser(this.hostId);
  }

  public get leader(): User {
    const leaderId = this.players[this.leaderIndex]?.userID;
    return getUser(leaderId);
  }

  public get rules(): Rules {
    return RULES[this.players.length];
  }

  public get isOpen() {
    return this.currentRound.roundName === 'lobby';
  }

  public get votesRemaining() {
    return 5 - this.currentMission.nominations.length;
  }

  constructor() {
    this.colouredId = chalk.hsl(...getHsl(this.id))(this.id);
    this.currentRound = new LobbyRound(this);
    this.currentMission = {
      missionNumber: 0,
      nominations: [],
      nominatedPlayerIds: [],
      votes: [],
    };
  }

  advanceLeader = () => {
    this.leaderIndex = (this.leaderIndex + 1) % this.players.length;
  };

  addPlayer = (userID: string): void => {
    if (this.players.find((p) => p.userID === userID))
      return console.error('That player is already in this game.');
    this.log(`Player ${getUser(userID)?.shortId} joined`);
    this.players.push({ userID, inGame: true });
  };

  setHost = (playerID: string): void => {
    const player = this.getPlayer(playerID);
    if (!player) return console.error(`No player found with id ${playerID}`);
    this.hostId = playerID;
  };

  getPlayer = (id: string): Player => this.players.find((p) => p.userID === id);

  sendUpdateToAllPlayers = (): void => {
    this.players.forEach((p) => this.sendGameUpdate(p.userID));
  };

  sendGameUpdate = (userID: string): void => {
    const player = this.players.find((p) => p.userID === userID);
    if (!player.inGame) {
      return;
    }
    const payload = this.generatePayload(userID);

    const user = getUser(userID);
    this.log(`Sending ${payload.data.stage} msg to ${user.shortId}`);

    send(userID, payload);
  };

  removePlayer = (playerID: string) => {
    this.players = this.players.map((p) =>
      p.userID === playerID ? { ...p, inGame: false } : p,
    );
    updateUser(playerID, { gameID: undefined });
    send(playerID, { event: 'returnToMainScreen', data: undefined });
    const activePlayers = this.players.filter((p) => p.inGame);
    if (activePlayers.length === 0) {
      storage.games.delete(this.id);
      // TODO archive game or something?
    }
  };

  generatePayload = (playerID: string): EventByName<'gameUpdateMessage'> => {
    const secretData = this.currentRound.getSecretData(playerID);
    const roundData = this.currentRound.getRoundData() ?? null;

    return {
      event: 'gameUpdateMessage',
      data: {
        gameID: this.id,
        missionNumber: this.currentMission.missionNumber,
        stage: this.currentRound.roundName,
        playerID,
        hostName: getUser(this.hostId)?.name,
        isHost: this.hostId === playerID,
        leaderID: this.leader.id,
        isLeader: this.leader.id === playerID,
        players: this.players
          .map(({ userID }) => getUser(userID))
          .map(({ name, id }) => ({ name, id })),
        characterInfo: getCharacterInfo(this.players, playerID),
        characters: (Object.keys(this.characters) as Character[]).filter(
          (name) => this.characters[name],
        ),
        roundData,
        secretData,
        history: getClientHistory(
          this.history,
          this.currentMission.nominations,
        ),
        rounds: Object.entries(this.rules?.missions ?? {}).map(([, o]) => [
          o.players,
          o.failsRequired,
        ]),
      },
    };
  };

  log = (...messages: any[]) => {
    console.log(
      chalk.blue(new Date().toLocaleTimeString()),
      this.colouredId,
      ...messages,
    );
  };

  randomiseLeader = () => {
    this.leaderIndex = Math.floor(Math.random() * this.players.length);
  };

  handleMessage = (message: Message): void => {
    const isValid = this.currentRound.validateMessage(message);
    if (!isValid) {
      this.sendGameUpdate(message.playerID);
      return this.log(
        'Invalid message received from',
        getUser(message.playerID)?.shortId,
      );
    }

    this.log('Received message', message.type);
    this.currentRound.handleMessage(message);
    this.sendUpdateToAllPlayers();

    if (this.currentRound.isReadyToComplete()) {
      this.completeCurrentRound();
    }
  };

  sendGameOverToAllPlayers = () => {
    this.players.forEach(({ userID }) => {
      send(userID, { event: 'endGame', data: {} });
    });
  };

  cancelGame = ({ playerID }: { playerID: string }) => {
    if (this.result.type === 'cancelled') {
      const user = getUser(this.result.cancelledBy);
      this.log(`Game already cancelled by ${user.shortId}`);
      return this.sendUpdateToAllPlayers();
    }
    const user = getUser(playerID);
    this.log(`Game cancelled by ${user.shortId}`);
    this.result = { type: 'cancelled', cancelledBy: playerID };
    this.currentRound = new GameOverRound(this);
    this.sendUpdateToAllPlayers();
  };

  completeCurrentRound = (): void => {
    this.log('Completing round', this.currentRound.roundName);
    const nextRoundName = this.currentRound.completeRound();

    if (this.currentRound.roundName === 'gameOver') {
      return;
    }
    this.history = this.currentRound.getUpdatedHistory();
    // TODO Is there a cleaner way to work out if the current round is final?
    if (this.currentRound.isFinal()) {
      this.log('Mission complete, moving onto next mission');
      this.nextMission();
    }
    this.log('Starting round', nextRoundName);
    const NextRound = rounds[nextRoundName];
    this.currentRound = new NextRound(this);
    this.sendUpdateToAllPlayers();
  };

  nextMission = (): void => {
    // ? Handle the case where the game is over here or in Mission Result?
    const nextMission: OngoingMission = {
      missionNumber: this.currentMission.missionNumber + 1,
      nominations: [],
      nominatedPlayerIds: [],
      votes: [],
    };
    this.currentMission = nextMission;
  };
}
