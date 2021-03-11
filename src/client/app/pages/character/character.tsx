import React, { PureComponent } from 'react';

import {
  GameData,
  CharacterRoundSecretData,
  CharacterRoundPublicData,
} from '@shared/types/gameData';
import Page from '../../components/page/page';
import listString from '../../helpers/listString';

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
    if (
      this.secretData.allegiance !== 'resistance' &&
      this.secretData.allegiance !== 'spies'
    )
      throw new Error('No allegiance received');
    return (
      <Page>
        {this.secretData.allegiance === 'resistance' ? (
          <h2>You are part of the RESISTANCE!</h2>
        ) : (
          <>
            <h2>
              You are a <strong>SPY</strong>
            </h2>
            <p>The spies in this game are....</p>
            {this.secretData.spies.map((s, i) => (
              <strong key={`spy-${i}`}>{s}</strong>
            ))}
          </>
        )}
        <button
          disabled={this.state.hasConfirmed}
          onClick={this.confirmCharacter}
          name="confirmcharacter"
        >
          OK
        </button>
        {playerIsWaiting && (
          <p>
            Waiting for{' '}
            {listString(this.roundData.unconfirmedPlayerNames, 'and')} to
            confirm...
          </p>
        )}
      </Page>
    );
  }
}
