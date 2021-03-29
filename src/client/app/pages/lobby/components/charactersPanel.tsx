import * as React from 'react';
import { Character as CheckboxContainer } from 'shared';
import styled from 'styled-components';

type Character = Exclude<CheckboxContainer, 'Assassin'>;

const CHARACTERS = [
  'Merlin',
  'Percival',
  'Morgana',
  'Mordred',
  'Oberon',
] as const;

const CheckboxContainer = styled.div<{ visible: boolean }>`
  display: flex;
  width: 100%;
  max-height: ${({ visible }) => (visible ? '30px' : '0')};
  transition: 0.5s;
  overflow-y: hidden;
  justify-content: flex-start;
  padding: ${({ visible }) => (visible ? '5px' : '0')} 5px;
`;

const Label = styled.label`
  padding-left: 10px;
`;

const CharacterCheckbox: React.FC<{
  onChange: () => void;
  character: Character;
  checked: boolean;
  visible: boolean;
}> = ({ character, onChange, checked, visible }) => {
  return (
    <CheckboxContainer visible={visible}>
      <input
        type="checkbox"
        id={character}
        checked={checked}
        onChange={onChange}
      />
      <Label htmlFor={character}>{character}</Label>
    </CheckboxContainer>
  );
};

const CharactersContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const OptionsPanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

type CharactersChoice = { [key in Character]?: boolean };

interface Props {
  characters: CharactersChoice;
  setCharacters: (n: Partial<CharactersChoice>) => void;
}

export const CharactersPanel: React.FC<Props> = ({
  characters,
  setCharacters,
}) => {
  const characterIsVisible = (name: Character, currentChars = characters) => {
    if (name === 'Merlin') return true;
    if (name === 'Oberon') return true;
    if (name === 'Percival') return currentChars['Merlin'];
    if (name === 'Morgana') return currentChars['Percival'];
    if (name === 'Mordred') return currentChars['Merlin'];
    return false;
  };

  const handleCharacterChange = (name: Character) => {
    const newCharacters: { [key in Character]?: boolean } = {
      ...characters,
      [name]: !characters[name],
    };

    CHARACTERS.forEach(
      (char) =>
        (newCharacters[char] =
          newCharacters[char] && characterIsVisible(char, newCharacters)),
    );
    setCharacters(newCharacters);
  };

  return (
    <OptionsPanel>
      <CharactersContainer>
        {CHARACTERS.map((name) => (
          <CharacterCheckbox
            character={name}
            checked={characters[name]}
            onChange={() => handleCharacterChange(name)}
            visible={characterIsVisible(name)}
          />
        ))}
      </CharactersContainer>
    </OptionsPanel>
  );
};
