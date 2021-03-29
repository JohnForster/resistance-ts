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
import { CharacterInfo } from '../../components/characterInfo/characterInfo';

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

    const numberUnconfirmed = this.roundData.unconfirmedPlayerNames.length;

    return (
      <Page>
        <CharacterInfo
          info={this.secretData}
          characters={this.props.game.characters}
        />
        <ContinueButton
          disabled={this.state.hasConfirmed}
          onClick={this.confirmCharacter}
          name="confirmcharacter"
          subtext={`Waiting for ${
            numberUnconfirmed > 1
              ? `${numberUnconfirmed} other people`
              : 'one other person'
          } to confirm...`}
          hideSubtext={!playerIsWaiting}
        />
      </Page>
    );
  }
}
