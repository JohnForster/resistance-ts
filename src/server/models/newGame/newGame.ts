import { EventByName } from '@shared/types/eventTypes';
import { RoundName } from '@shared/types/gameData';
import { Message } from '@shared/types/messages';

import generateID from '../../utils/generateID';
import { Rules, RULES } from '../../data/gameRules';

import User from '../user';

import { LobbyRound, Round } from './rounds';
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
    playerID: PlayerId;
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

  constructor() {
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
    if (this.players.includes(player))
      return console.error('That player is already in this game.');
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
    player.send(payload);
  };

  generatePayload = (player: User): EventByName<'serverMessage'> => {
    const secretData = this.currentRound?.getSecretData(player.id) ?? null;
    const roundData = this.currentRound?.getRoundData() ?? null;
    return {
      event: 'serverMessage',
      data: {
        gameID: this.id,
        missionNumber: this.currentMission.missionNumber,
        stage: this.currentRound.roundName,
        playerID: player.id,
        hostName: this.host.name,
        isHost: this.host === player,
        leaderName: this.leader?.name,
        isLeader: this.leader === player,
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

  handleMessage = (message: Message): void => {
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
