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

export interface Player extends User {
  allegiance?: 'resistance' | 'spies';
  // character?: Character;
}

export interface Nomination {
  leader: Player;
  nominatedPlayers: Player[];
  votes: Map<Player['id'], boolean>;
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

console.log("getHsl('f36', 16):", getHsl('f36', 16));

export class Game {
  readonly id: string = generateID();
  readonly colouredId: string;
  // TODO change players to be an id -> player map?
  public players: Player[] = [];

  private currentRound: Round<RoundName>; /* = new Lobby(this); */
  public currentMission: OngoingMission;
  public votesRemaining: number;
  public history: GameHistory = {};
  private leaderIndex = 0;
  public host: Player;

  public get leader(): Player {
    return this.players[this.leaderIndex];
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

  addPlayer = (player: Player): void => {
    if (this.players.find((p) => p.id === player.id))
      return console.error('That player is already in this game.');
    this.log(`Player ${player.shortId} joined`);
    this.players.push(player);
  };

  setHost = (playerID: string): void => {
    const player = this.getPlayer(playerID);
    if (!player) return console.error(`No player found with id ${playerID}`);
    this.host = player;
  };

  getPlayer = (id: string): Player => this.players.find((p) => p.id === id);

  sendUpdateToAllPlayers = (): void => {
    this.players.forEach(this.sendGameUpdate);
  };

  sendGameUpdate = (player: User): void => {
    const payload = this.generatePayload(player);
    this.log(`Sending ${payload.data.stage} msg to ${player.shortId}`);
    send(player, payload);
  };

  generatePayload = (player: User): EventByName<'serverMessage'> => {
    const secretData = this.currentRound.getSecretData(player.id) ?? null;
    const roundData = this.currentRound.getRoundData() ?? null;
    return {
      event: 'serverMessage',
      data: {
        gameID: this.id,
        missionNumber: this.currentMission.missionNumber,
        stage: this.currentRound.roundName,
        playerID: player.id,
        hostName: this.host.name,
        isHost: this.host.id === player.id,
        leaderName: this.leader?.name,
        isLeader: this.leader.id === player.id,
        players: this.players.map((p) => ({ name: p.name, id: p.id })),
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
      const player = this.players.find((p) => p.id === message.playerID);
      this.sendGameUpdate(player);
      return this.log('Invalid message received from', player.shortId);
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
