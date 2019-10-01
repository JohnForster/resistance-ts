interface CharacterData {
  character: 'resistance' | 'spy';
  spies?: string[];
}

export interface GameData {
  gameID: string;
  round: number;
  stage: 'lobby' | 'characterAssignment' | 'nominate' | 'nominationVote' | 'missionVote';
  hostID: string;
  playerID: string;
  players: {
    name: string;
  }[];
  roundData: {};
  secretData?: CharacterData;
}
