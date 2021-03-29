import { Player } from '../models/game/game';
import { getUser } from '../models/user';
import { CharacterInformation } from 'shared';
import { spy } from './spy';
import { shuffle } from 'lodash';

const getVisibleSpies = (
  player: Player,
  spies: Player[],
): (string | null)[] => {
  // Merlin sees all evil characters except Mordred
  if (player.character === 'Merlin') {
    return spies.map((p) => (p.character === 'Mordred' ? null : p.userID));
  }

  // Oberon only sees himself
  if (player.character === 'Oberon') {
    return spies.map((p) => (p.userID === player.userID ? p.userID : null));
  }

  // The spies see all other spies except Oberon
  if (player.allegiance === 'spies') {
    return spies.map((p) => (p.character === 'Oberon' ? null : p.userID));
  }

  return spies.map((_) => null);
};

export const getCharacterInfo = (
  players: Player[],
  playerID: string,
): CharacterInformation | undefined => {
  const player = players.find((p) => p.userID === playerID);
  const { allegiance, character } = player;
  if (!allegiance) return;

  const spies = players.filter((p) => p.allegiance === 'spies');
  spies.sort((a, b) => (a.userID > b.userID ? 1 : -1));

  const visibleSpies = getVisibleSpies(player, spies).map((id) =>
    spy(id && getUser(id)?.name),
  );

  const merlin =
    player.character === 'Percival'
      ? players
          .filter((p) => p.character === 'Merlin' || p.character === 'Morgana')
          .map((p) => getUser(p.userID)?.name)
      : [];

  return {
    allegiance,
    character,
    spies: shuffle(visibleSpies),
    merlin,
  };
};
