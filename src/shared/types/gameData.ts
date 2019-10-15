interface CharacterData {
  character: 'resistance' | 'spy';
  spies?: string[];
}

export interface GameData {
  gameID: string;
  round: number;
  stage: 'lobby' | 'characterAssignment' | 'nominate' | 'nominationVote' | 'missionVote';
  hostName: string;
  isHost: boolean;
  playerID: string;
  players: {
    name: string;
  }[];
  roundData: any;
  secretData?: CharacterData;
}
