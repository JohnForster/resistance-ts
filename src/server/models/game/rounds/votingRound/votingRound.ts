import { Rules } from '../../../../data/gameRules';
import { Round } from '../round';
import { VotingRoundData, VotingRoundSecretData } from '@shared/types/gameData';
import { RoundName } from '@server/types/enums';
import { Player } from '../../game';

export class VotingRound implements Round {
  public readonly roundName = RoundName.voting;
  public voteSucceded: boolean;
  public isActive = true;

  private readonly _players: Player[];
  private readonly _rules: Rules;
  private readonly _votingRoundNumber: number;
  private readonly _nominatedPlayers: Player[];
  private _votes: Map<Player['id'], boolean> = new Map();
  private _leaderIndex: number;

  public get leaderIndex(): number {
    return this._leaderIndex;
  }

  public get votingRoundNumber(): number {
    return this._votingRoundNumber;
  }

  private get votes(): { id: string; name: string; playerApproves: boolean }[] {
    return Array.from(this._votes).map(([id, vote]) => ({
      id,
      name: this._players.find(p => p.id == id).name,
      playerApproves: vote,
    }));
  }

  public get hasVoteCompleted(): boolean {
    return this._votes.size === this._players.length;
  }

  public get unconfirmedPlayers(): Player[] {
    return this._players.filter(p => !this._votes.has(p.id));
  }

  constructor(players: Player[], rules: Rules, votingRoundNumber: number, nominatedPlayerIDs: string[]) {
    this._players = players;
    this._rules = rules;
    this._votingRoundNumber = votingRoundNumber;
    this._nominatedPlayers = players.filter(p => nominatedPlayerIDs.includes(p.id));
  }

  public countVotes = () => {
    const votesArray = Array.from(this._votes);
    const ayeVotes = votesArray.filter(([, approve]) => approve).length;
    const nayVotes = votesArray.filter(([, approve]) => !approve).length;
    if (ayeVotes + nayVotes !== this._players.length) throw new Error('Incorrect number of votes cast');
    this.voteSucceded = ayeVotes > nayVotes;
  };

  public vote = (playerID: string, approves: boolean): void => {
    const player = this._players.find(p => p.id === playerID);
    if (!player) throw new Error(`Player with id ${playerID} is not part of this game!`);
    this._votes.set(player.id, approves);
  };

  public getRoundData = (): VotingRoundData => ({
    roundName: RoundName.voting,
    // leader: this._players[this._leaderIndex].name,
    // player order - who is nominating next
    unconfirmedPlayerNames: this.unconfirmedPlayers.map(p => p.name),
    votes: this.hasVoteCompleted ? this.votes : undefined,
    nominatedPlayers: this._nominatedPlayers.map(p => ({ name: p.name, id: p.id })),
  });

  public getSecretData = (playerID: string): VotingRoundSecretData => ({
    playerApproves: this._votes.get(playerID),
  });
}
