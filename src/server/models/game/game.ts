import { EventByName } from '@shared/types/eventTypes';
import { RoundName } from '@shared/types/gameData';
import { Message } from '@shared/types/messages';

import generateID from '../../utils/generateID';
import { getHsl } from '../../utils/getHsl';
import { Rules, RULES } from '../../data/gameRules';

import { send, User } from '../user';

import { LobbyRound, Round } from './rounds';
import { rounds } from './config';
import chalk from 'chalk';
import { storage } from '@server/storage/storage';

export interface Player {
  userId: string;
  allegiance?: 'resistance' | 'spies';
  // character?: Character;
}

export interface Nomination {
  leader: Player;
  nominatedPlayers: Player[];
  votes: Map<Player['userId'], boolean>;
  succeeded?: boolean;
}

export interface CompletedMission {
  missionNumber: number;
  nominations: Nomination[];
  nominatedPlayers: Player[];
  votes: {
    playerID: PlayerId;
    succeed: boolean;
  }[];
  success: boolean;
}

export type OngoingMission = Omit<CompletedMission, 'success'> & {
  success?: boolean;
};

export type GameHistory = Record<number, CompletedMission>;

export type PlayerId = string;

export class Game {
  readonly id: string = generateID();
  readonly colouredId: string;
  public players: Player[] = [];

  private currentRound: Round<RoundName>; /* = new Lobby(this); */
  public currentMission: OngoingMission;
  public votesRemaining: number;
  public history: GameHistory = {};
  private leaderIndex = 0;
  private hostId: string;

  public get host(): User {
    return storage.users.get(this.hostId);
  }

  public get leader(): User {
    const leaderId = this.players[this.leaderIndex]?.userId;
    return storage.users.get(leaderId);
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
      nominatedPlayers: [],
      votes: [],
    };
  }

  addPlayer = (userId: string): void => {
    if (this.players.find((p) => p.userId === userId))
      return console.error('That player is already in this game.');
    // this.log(`Player ${player.shortId} joined`);
    this.players.push({ userId });
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
    const payload = this.generatePayload(userId);

    const user = storage.users.get(userId);
    this.log(`Sending ${payload.data.stage} msg to ${user.shortId}`);
    send(user, payload);
  };

  generatePayload = (playerId: string): EventByName<'serverMessage'> => {
    const secretData = this.currentRound.getSecretData(playerId) ?? null;
    const roundData = this.currentRound.getRoundData() ?? null;
    const host = storage.users.get(playerId);

    return {
      event: 'serverMessage',
      data: {
        gameID: this.id,
        missionNumber: this.currentMission.missionNumber,
        stage: this.currentRound.roundName,
        playerID: playerId,
        hostName: host.name,
        isHost: host.id === playerId,
        leaderName: this.leader?.name,
        isLeader: this.leader.id === playerId,
        players: this.players
          .map(({ userId }) => storage.users.get(userId))
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
      // return this.log('Invalid message received from', player.shortId);
      return;
    }

    this.log('Received message', message.type);
    this.currentRound.handleMessage(message);
    this.sendUpdateToAllPlayers();

    if (this.currentRound.isReadyToComplete()) {
      this.completeCurrentRound();
    }
  };

  completeCurrentRound = (): void => {
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
    // Handle the case where the game is over here or in Mission Result?
    const nextMission: OngoingMission = {
      missionNumber: this.currentMission.missionNumber + 1,
      nominations: [],
      nominatedPlayers: [],
      votes: [],
    };
    this.currentMission = nextMission;
  };
}
