import { EventByName } from '../../../shared/types/eventTypes';

import { EventType } from '../../types/enums';
import generateID from '../../utils/generateID';
import { Rules } from '../../data/gameRules';

import User from '../user';

import { Round } from './rounds';
import { rounds } from './config';

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

export interface Mission {
  missionNumber: number;
  nominations: Nomination[];
  nominatedPlayers: Player[];
  votes: {
    playerId: PlayerId;
    succeed: boolean;
  }[];
  success: boolean;
}

export type OngoingMission = Omit<Mission, 'success'> & {
  success?: boolean;
};

export type GameHistory = Record<number, Mission>;

export type PlayerId = string;

export class Game {
  readonly id: string = generateID();
  readonly players: Player[] = [];

  private currentRound: Round<unknown>; /* = new Lobby(this); */
  public currentMission: OngoingMission = {
    missionNumber: 0, // TODO should be set in constructor
    nominations: [],
    nominatedPlayers: [],
    votes: [],
  };
  public votesRemaining: number;
  // ! HOW TO DEAL WITH HISTORY?
  public history: GameHistory = {};
  private leaderIndex: number;
  private host: Player;
  public leader;

  constructor(public rules: Rules) {
    // this.votesRemaining = rules.numberOfVotesAllowed
    this.votesRemaining = 5;
  }

  addPlayer = (player: Player): void => {
    if (this.players.includes(player))
      return console.error('That player is already in this game.');
    this.players.push(player);
  };

  setHost = (playerId: string): void => {
    const player = this.getPlayer(playerId);
    if (!player) return console.error(`No player found with id ${playerId}`);
    this.host = player;
  };

  getPlayer = (id: string): Player => this.players.find((p) => p.id === id);

  sendUpdateToAllPlayers = (): void => {
    this.players.forEach(this.sendGameUpdate);
  };

  sendGameUpdate = (player: User): void => {
    const payload = this.generatePayload(player);
    player.send(payload);
  };

  generatePayload = (
    player: User,
  ): EventByName<typeof EventType.gameUpdate> => {
    const secretData = this.currentRound?.getSecretData(player.id) ?? null;
    const roundData = this.currentRound?.getRoundData() ?? null;
    return {
      event: EventType.gameUpdate,
      data: {
        gameID: this.id,
        missionNumber: this.currentMission.missionNumber,
        stage: this.currentRound.roundName, // TODO Align round names between frontend && backend
        playerID: player.id,
        hostName: this.host.name,
        isHost: this.host === player,
        leaderName: this.leader.name,
        isLeader: this.leader === player,
        players: this.players.map((p) => ({ name: p.name, id: p.id })),
        roundData,
        secretData,
        // history: this._progress.missions.map(m => m.result),
        rounds: Object.entries(this.rules.missions).map(([, o]) => [
          o.players,
          o.failsRequired,
        ]),
      },
    };
  };

  onMessage = (message: unknown): void => {
    const isValid = this.currentRound.validateMessage(message);
    if (!isValid) return console.error('Not valid');

    this.currentRound.handleMessage(message);

    if (this.currentRound.isReadyToComplete()) {
      this.completeCurrentRound();
    }
  };

  completeCurrentRound = (): void => {
    const nextRoundName = this.currentRound.completeRound();
    this.history = this.currentRound.getUpdatedHistory();
    // TODO Is there a cleaner way to work out if the current round is final?
    if (this.currentRound.isFinal()) {
      return this.nextMission();
    }
    const NextRound = rounds[nextRoundName];
    this.currentRound = new NextRound(this);
  };

  nextMission = (): void => {
    // Handle the case where the game is over here or in Mission Result?
  };
}
