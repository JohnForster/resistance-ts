import User from '../user';

import { EventType, Character } from '@server/types/enums';
import generateID from '@server/utils/generateID';
import { EventByName } from '@shared/types/eventTypes';

import { Round } from './rounds';
import { Rules } from '../../data/gameRules';
import { rounds } from './config';

export interface Player extends User {
  allegiance?: 'resistance' | 'spies';
  character?: Character;
}

export class Game {
  readonly id: string = generateID();
  readonly players: Player[] = [];

  private currentRound: Round; /* = new Lobby(this); */
  public missionNumber;
  // ! HOW TO DEAL WITH HISTORY?
  private history: unknown[];
  private leaderIndex: number;
  private host: Player;
  public leader;

  constructor(public rules: Rules) {}

  addPlayer = (player: Player): void => {
    if (this.players.includes(player)) return console.error('That player is already in this game.');
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

  generatePayload = (player: User): EventByName<typeof EventType.gameUpdate> => {
    const secretData = (this.currentRound && this.currentRound.getSecretData(player.id)) || null;
    const roundData = (this.currentRound && this.currentRound.getRoundData()) || null;
    return {
      event: EventType.gameUpdate,
      data: {
        gameID: this.id,
        missionNumber: this.missionNumber,
        stage: this.currentRound.roundName,
        playerID: player.id,
        hostName: this.host.name,
        isHost: this.host === player,
        leaderName: this.leader.name,
        isLeader: this.leader === player,
        players: this.players.map((p) => ({ name: p.name, id: p.id })),
        roundData,
        secretData,
        // history: this._progress.missions.map(m => m.result),
        rounds: Object.entries(this.rules.missions).map(([, o]) => [o.players, o.failsRequired]),
      },
    };
  };

  onMessage = (message: unknown): void => {
    const isValid = this.currentRound.validateMessage(message);
    if (!isValid) return console.error('Not valid');

    this.currentRound.handleMessage(message);

    if (this.currentRound.roundIsReadyToComplete()) {
      this.completeCurrentRound();
    }
  };

  completeCurrentRound = (): void => {
    const nextRoundName = this.currentRound.completeRound();
    const history = this.currentRound.getHistory();
    this.history.push(history);
    // TODO Is there a cleaner way to work out if the current round is final?
    if (this.currentRound.isFinal()) {
      return this.nextMission();
    }
    const NextRound = rounds[nextRoundName];
    this.currentRound = new NextRound(this);
  };

  nextMission = (): void => {};
}
