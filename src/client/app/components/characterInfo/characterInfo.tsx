import * as React from 'react';
import { Character, CharacterInformation } from 'shared';

const characterMessages: { [key in Character]?: string } = {
  Mordred: 'Merlin does not know you are a spy',
  Morgana: 'Percival thinks you may be Merlin',
  Merlin: 'If the spies work out your identity, all is lost',
  Oberon: 'The spies do not know you are one of them.',
  Percival: "You must protect Merlin's identity",
  Assassin: 'You must try to work out who is Merlin',
};

interface Props {
  info: CharacterInformation;
  characters: Character[];
}

export const CharacterInfo: React.FC<Props> = ({
  characters,
  info: { allegiance, character, spies, merlin },
}) => {
  const message = characterMessages[character];
  return (
    <>
      {allegiance === 'resistance' ? (
        <h2>You are part of the RESISTANCE</h2>
      ) : (
        <h2>
          You are a <strong>SPY</strong>
        </h2>
      )}
      {allegiance === 'resistance' && !character && (
        <>
          <p>There are {spies.length} spies among you.</p>
          {characters.includes('Merlin') && (
            <p>One of your allies knows who they are...</p>
          )}
          <p>Try to work out who is lying before it's too late!</p>
        </>
      )}
      {character && (
        <h2>
          You are {character === 'Assassin' ? `the ${character}` : character}.
        </h2>
      )}
      {message && <p>{message}</p>}
      {character === 'Percival' &&
        (merlin.length === 2 ? (
          <>
            <p>Merlin is either</p>
            <strong>{merlin[0]}</strong>
            or
            <strong>{merlin[1]}</strong>
            <p>The other is an an enemy...</p>
          </>
        ) : (
          <>
            Merlin is <strong>{merlin[0]}</strong>
          </>
        ))}
      {character === 'Oberon' &&
        (spies.length - 1 > 1
          ? `There are ${spies.length - 1} other spies in the game.`
          : 'There is one other spy in the game.')}
      {spies.find((s) => s.type === 'known') && character !== 'Oberon' && (
        <>
          <p>The spies in this game are....</p>
          {spies
            .filter((s) => s.type === 'known')
            .map((s, i) =>
              s.type === 'known' ? (
                <strong key={`spy-${i}`}>{s.name}</strong>
              ) : (
                <strong>?????</strong>
              ),
            )}
          {spies.find((s) => s.type === 'unknown') && (
            <p>and one other who is unknown to you...</p>
          )}
        </>
      )}
    </>
  );
};
