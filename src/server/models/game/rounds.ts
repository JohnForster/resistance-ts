import generateID from '@server/utils/generateID';
import { Player } from './game';

// type RoundName = 'lobby' | 'character' | 'nomination' | 'vote' | 'voteResult' | 'mission' | 'missionResults' | 'gameOver';
type RoundName = 'nomination';

interface RoundConstructor {
  new (game: Game): Round;
}

interface Round<Message = unknown> {
  handleMessage: (message: Message) => void;

  validateMessage: (message: Message) => boolean;

  roundIsReadyToComplete: () => boolean;

  completeRound: () => RoundName;

  getRoundData: () => any;

  getSecretData: (id: string) => any;

  isFinal: () => boolean;

  getHistory: () => any;
}

interface NominationMessage {
  nominatedPlayerIds: string[];
}
class NominationRound implements Round<NominationMessage> {
  private data: any;

  constructor(private readonly game: Game) {}

  handleMessage = (message: NominationMessage): void => {
    if (!message.nominatedPlayerIds.every(id => this.game.players.includes(id))) return;
    this.data.nominatedPlayerIds = message.nominatedPlayerIds;
  };

  validateMessage = (message: NominationMessage): boolean => {
    return true;
  };

  roundIsReadyToComplete: () => boolean;

  completeRound: () => RoundName;

  getRoundData: () => any;

  getSecretData: (id: string) => any;

  isFinal: () => false;

  getHistory: () => {};
}

const rounds: { [key in RoundName]: RoundConstructor } = {
  nomination: NominationRound,
};

class Game {
  readonly id: string = generateID();
  readonly players: Player[] = [];

  private currentRound: Round;
  private history: unknown[];
  private leaderIndex: number;
  private host: Player;

  addPlayer = (player: Player): void => {
    if (this.players.includes(player)) return console.error('That player is already in this game.');
    this.players.push(player);
  };

  setHost = (playerId: string): void => {
    const player = this.getPlayer(playerId);
    if (!player) return console.error(`No player found with id ${playerId}`);
    this.host = player;
  };

  getPlayer = (id: string): Player => this.players.find(p => p.id === id);

  sendUpdateToAllPlayers = (): void => {
    this.players.forEach(this.sendGameUpdate);
  };

  sendGameUpdate = (player: User): void => {
    const payload = this.generatePayload(player);
    player.send(payload);
  };

  generatePayload = (player: User): EventByName<typeof EventType.gameUpdate> => {
    const secretData = (this._currentRound && this._currentRound.getSecretData(player.id)) || null;
    const roundData = (this._currentRound && this._currentRound.getRoundData()) || null;
    return {
      event: EventType.gameUpdate,
      data: {
        gameID: this._id,
        missionNumber: this._missionNumber,
        stage: this._currentRound.roundName,
        playerID: player.id,
        hostName: this._host.name,
        isHost: this._host === player,
        leaderName: this.leader.name,
        isLeader: this.leader === player,
        players: this._players.map(p => ({ name: p.name, id: p.id })),
        roundData,
        secretData,
        history: this._progress.missions.map(m => m.result),
        rounds: Object.entries(this._rules?.missions || []).map(([, o]) => [o.players, o.failsRequired]),
      },
    };
  };

  onMessage = (message: any): void => {
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

const missionPhases = {
  nomination: {
    message: {
      nominatedPlayers: Array,
    },

    nextRound(this: Game, nominatedPlayerIds: string[]) {
      if (nominatedPlayerIds) {
      }
    },
    next: 'vote',
  },
  vote: {
    message: {
      playerId: String,
      approves: Boolean,
    },
    next: 'voteResults',
  },
  voteResults: {
    message: {
      playerId: String,
      isReady: String,
    },
    next: ['mission', 'nomination'],
  },
  mission: {
    message: {
      playerId: String,
      succeeds: Boolean,
    },
    next: 'missionResults',
  },
  missionResults: {
    message: {
      playerId: String,
      isReady: Boolean,
    },
    next: 'new',
  },
};
