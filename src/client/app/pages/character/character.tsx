import React, { PureComponent } from 'react';

import {
  GameData,
  CharacterRoundSecretData,
  CharacterRoundPublicData,
  Character,
} from 'shared';
import Page from '../../components/page/page';
import listString from '../../helpers/listString';
import { ContinueButton } from '../../components/continueButton/continueButton';

export interface CharacterPageProps {
  confirmCharacter: () => void;
  game: GameData<'character'>;
}

interface CharacterPageState {
  hasConfirmed: boolean;
}

export class CharacterPage extends PureComponent<
  CharacterPageProps,
  CharacterPageState
> {
  characterMessages: { [key in Character]?: string } = {
    Mordred: 'Merlin does not know you are a spy',
    Morgana: 'Percival thinks you might be Merlin',
    Merlin: 'If the spies work out your identity, all is lost',
    Oberon: 'The other spies do not know you are one of them',
    Percival: "You must protect Merlin's identity",
    Assassin:
      'Merlin knows who the spies are, you must try to work out who that is',
  };

  state: CharacterPageState = {
    hasConfirmed: false,
  };

  get roundData(): CharacterRoundPublicData {
    return this.props.game.roundData;
  }

  get secretData(): CharacterRoundSecretData {
    return this.props.game.secretData;
  }

  confirmCharacter = (): void => {
    this.props.confirmCharacter();
    this.setState({ hasConfirmed: true });
  };

  render(): JSX.Element {
    const roundData = this.props.game.roundData;
    const playerIsWaiting = !!(
      this.state.hasConfirmed &&
      this.props.game &&
      roundData.unconfirmedPlayerNames
    );
    const { character, allegiance, merlin, spies } = this.secretData;
    if (allegiance !== 'resistance' && allegiance !== 'spies')
      throw new Error('No allegiance received');

    const characterMessage = this.characterMessages[character];

    return (
      <Page>
        {allegiance === 'resistance' ? (
          <h2>You are part of the RESISTANCE</h2>
        ) : (
          <h2>
            You are a <strong>SPY</strong>
          </h2>
        )}
        {character && (
          <h2>
            You are {character === 'Assassin' ? `the ${character}` : character}.
          </h2>
        )}
        {characterMessage && <p>{characterMessage}</p>}
        {character === 'Percival' &&
          (merlin.length === 2 ? (
            <>
              <p>Merlin is either</p>
              <strong>{merlin[0]}</strong>
              or
              <strong>{merlin[1]}</strong>
            </>
          ) : (
            <>
              Merlin is <strong>{merlin[0]}</strong>
            </>
          ))}
        {(spies.find((s) => s.type === 'known') || character === 'Oberon') && (
          <>
            <p>The spies in this game are....</p>
            {spies.map((s, i) =>
              s.type === 'known' ? (
                <strong key={`spy-${i}`}>{s.name}</strong>
              ) : (
                <strong>?????</strong>
              ),
            )}
          </>
        )}
        <ContinueButton
          disabled={this.state.hasConfirmed}
          onClick={this.confirmCharacter}
          name="confirmcharacter"
          subtext={`Waiting for ${listString(
            this.roundData.unconfirmedPlayerNames,
            'and',
          )} to confirm...`}
          hideSubtext={!playerIsWaiting}
        />
      </Page>
    );
  }
}
