import { EventByName } from '@shared/types/eventTypes';
import {
  GameHistory,
  OngoingMission,
  PlayerId,
  RoundName,
} from '@shared/types/gameData';
import { Message } from '@shared/types/messages';

import generateID from '../../utils/generateID';
import { getHsl } from '../../utils/getHsl';
import { Rules, RULES } from '../../data/gameRules';

import { getUser, send, updateUser, User } from '../user';

import { LobbyRound, Round } from './rounds';
import { rounds } from './config';
import chalk from 'chalk';

export interface Player {
  inGame: boolean;
  userId: PlayerId;
  allegiance?: 'resistance' | 'spies';
  // character?: Character;
}

export type GameResult =
  | {
      type: 'completed';
      winners: 'spies' | 'resistance';
      gameOverReason: 'nominations' | 'missions';
    }
  | { type: 'ongoing' };

export class Game {
  readonly id: string = generateID();
  readonly colouredId: string;
  public players: Player[] = [];

  public currentMission: OngoingMission;
  public votesRemaining: number;
  // TODO Should GameHistory be an array?
  public history: GameHistory = {};
  public hostId: string;
  public result: GameResult = { type: 'ongoing' };

  private currentRound: Round<RoundName>;
  private leaderIndex = 0;

  public get host(): User {
    return getUser(this.hostId);
  }

  public get leader(): User {
    const leaderId = this.players[this.leaderIndex]?.userId;
    return getUser(leaderId);
  }

  public get rules(): Rules {
    return RULES[this.players.length];
  }

  public get isOpen() {
    return this.currentRound.roundName === 'lobby';
  }

  constructor() {
    this.colouredId = chalk.hsl(...getHsl(this.id))(this.id);
    this.votesRemaining = 5;
    this.currentRound = new LobbyRound(this);
    this.currentMission = {
      missionNumber: 0,
      nominations: [],
      nominatedPlayerIds: [],
      votes: [],
    };
  }

  addPlayer = (userId: string): void => {
    if (this.players.find((p) => p.userId === userId))
      return console.error('That player is already in this game.');
    this.log(`Player ${getUser(userId)?.shortId} joined`);
    this.players.push({ userId, inGame: true });
  };

  setHost = (playerID: string): void => {
    const player = this.getPlayer(playerID);
    if (!player) return console.error(`No player found with id ${playerID}`);
    this.hostId = playerID;
  };

  getPlayer = (id: string): Player => this.players.find((p) => p.userId === id);

  sendUpdateToAllPlayers = (): void => {
    this.players.forEach((p) => this.sendGameUpdate(p.userId));
  };

  sendGameUpdate = (userId: string): void => {
    const player = this.players.find((p) => p.userId === userId);
    if (!player.inGame) {
      return;
    }
    const payload = this.generatePayload(userId);

    const user = getUser(userId);
    this.log(`Sending ${payload.data.stage} msg to ${user.shortId}`);

    send(userId, payload);
  };

  removePlayer = (playerId: string) => {
    this.players = this.players.map((p) =>
      p.userId === playerId ? { ...p, inGame: false } : p,
    );
    updateUser(playerId, { gameID: undefined });
    send(playerId, { event: 'returnToMainScreen', data: undefined });
    const activePlayers = this.players.filter((p) => p.inGame);
    if (activePlayers.length === 0) {
      // TODO archive game or something?
    }
  };

  generatePayload = (playerId: string): EventByName<'gameUpdateMessage'> => {
    const secretData = this.currentRound.getSecretData(playerId);
    const roundData = this.currentRound.getRoundData() ?? null;

    return {
      event: 'gameUpdateMessage',
      data: {
        gameID: this.id,
        missionNumber: this.currentMission.missionNumber,
        stage: this.currentRound.roundName,
        playerID: playerId,
        hostName: getUser(this.hostId)?.name,
        isHost: this.hostId === playerId,
        leaderName: this.leader?.name,
        isLeader: this.leader.id === playerId,
        players: this.players
          .map(({ userId }) => getUser(userId))
          .map(({ name, id }) => ({ name, id })),
        roundData,
        secretData,
        history: Object.values(this.history).map((m) => m.success),
        rounds: Object.entries(this.rules?.missions ?? {}).map(([, o]) => [
          o.players,
          o.failsRequired,
        ]),
      },
    };
  };

  log = (...messages: string[]) => {
    console.log(
      chalk.blue(new Date().toLocaleTimeString()),
      this.colouredId,
      ...messages,
    );
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
    this.players.forEach(({ userId }) => {
      send(userId, { event: 'endGame', data: {} });
    });
  };

  completeCurrentRound = (): void => {
    if (this.currentRound.roundName === 'gameOver') {
      this.sendGameOverToAllPlayers();
      return;
    }

    this.log('Completing round', this.currentRound.roundName);
    const nextRoundName = this.currentRound.completeRound();
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
