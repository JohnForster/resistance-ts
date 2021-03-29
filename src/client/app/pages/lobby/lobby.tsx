import React from 'react';
import { Character, GameData, PlayerData } from 'shared';
import styled from 'styled-components';

import Page from '../../components/page/page';
import { ContinueButton } from '../../components/continueButton/continueButton';
import { Tabs } from '../../components/tabs/tabs';

import { PlayerList } from './components/playerList';
import { CharactersPanel } from './components/charactersPanel';
import { RULES } from 'shared/data/gameRules';

export const GameID = styled.p`
  font-family: 'Sans Serif';
  font-size: 40px;
  margin: 0;
`;

const RedSpan = styled.span`
  color: red;
`;

type CharacterSettings = { [key in Exclude<Character, 'Assassin'>]?: boolean };

export interface LobbyPageProps {
  game: GameData<'lobby'>;
  beginGame: (characters: CharacterSettings) => void;
}

const EVIL_CHARACTERS: Character[] = ['Morgana', 'Mordred', 'Oberon'];

const validateCharacters = (
  numPlayers: number,
  characters: CharacterSettings,
) => {
  const characterArray = (Object.entries(characters) as [Character, boolean][])
    .filter(([_, bool]) => bool)
    .map(([name]) => name);

  const numberOfEvilPlayers = RULES[numPlayers]?.numberOfSpies ?? 0;

  if (characterArray.length > numPlayers)
    return `Cannot have ${characterArray.length} characters with only ${numPlayers} players`;

  const numEvilCharacters = characterArray.filter((name) =>
    EVIL_CHARACTERS.includes(name),
  ).length;

  // +1 for the Assassin
  if (numEvilCharacters + 1 > numberOfEvilPlayers)
    return `Can have maximum ${
      numberOfEvilPlayers - 1
    } spy characters in a ${numPlayers} player game.`;

  return '';
};

// Note: for games of 5, be sure to add either Mordred or Morgana when playing with Percival.
export const LobbyPage: React.FC<LobbyPageProps> = ({ game, beginGame }) => {
  const [characters, setCharacters] = React.useState<CharacterSettings>({});

  const charactersError = validateCharacters(game.players.length, characters);
  console.log('charactersError:', charactersError);

  return (
    <Page>
      <h1>Lobby</h1>
      <p>Game ID: </p>
      <GameID id="gameID">{game.gameID}</GameID>
      {game.isHost ? (
        <Tabs titles={['Players', 'Characters']}>
          <>
            <PlayerList game={game} />
            <ContinueButton
              hidden={false}
              name="begingame"
              onClick={() => beginGame(characters)}
              disabled={game.players.length < 2 || !!charactersError}
              text="Begin Game"
              subtext={<RedSpan>{charactersError}</RedSpan>}
              hideSubtext={game.players.length < 2 || !charactersError}
            />
          </>
          <CharactersPanel
            characters={characters}
            setCharacters={setCharacters}
          />
        </Tabs>
      ) : (
        <>
          <PlayerList game={game} />
          <ContinueButton
            hidden={true}
            name="begingame"
            onClick={() => beginGame(characters)}
            disabled={game.players.length < 2}
            text="Begin Game"
            subtext={`Waiting for ${game.hostName} to start the game.`}
            hideSubtext={game.isHost}
          />
        </>
      )}
    </Page>
  );
};
