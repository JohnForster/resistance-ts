export type RoundNameEnum = {
  characterAssignment: 'characterAssignment';
  nomination: 'nomination';
  lobby: 'lobby';
  voting: 'voting';
  mission: 'mission';
  missionResult: 'missionResult';
};

export type CharacterEnum = {
  Merlin: 'merlin';
  Assassin: 'assassin';
  Percival: 'percival';
  Morgana: 'morgana';
  Mordred: 'mordred';
};

export type EventTypeEnum = {
  confirm: 'confirm';
  beginGame: 'beginGame';
  createGame: 'createGame';
  joinGame: 'joinGame';
  message: 'message';
  close: 'close';
  open: 'open';
  error: 'error';
  playerData: 'playerData';
  gameUpdate: 'gameUpdate';
  nominate: 'nominate';
  vote: 'vote';
  mission: 'mission';
  continue: 'continue';
};
