export interface GameData {
  gameID: string;
  round: number;
  stage: 'lobby' | 'characterAssignment' | 'nominate' | 'nominationVote' | 'missionVote';
  hostID: string;
  playerID: string;
  players: {
    name: string;
    id: string;
  }[];
  roundData: {};
  privateData: any;
}
