import React, { PureComponent } from 'react';
import { GameData, CharacterSecretData, CharacterRoundData, RoundData, SecretData } from '@shared/types/gameData';
import Page from '../../components/page/page';
import listString from '../../helpers/listString';

export interface CharacterPageProps {
  confirmCharacter: () => void;
  game: GameData;
}

interface CharacterPageState {
  hasConfirmed: boolean;
}

export class CharacterPage extends PureComponent<CharacterPageProps, CharacterPageState> {
  state: CharacterPageState = {
    hasConfirmed: false,
  };

  get roundData(): CharacterRoundData {
    if (!this.isCharacterRound(this.props.game.roundData)) throw new Error("This isn't character data!");
    return this.props.game.roundData;
  }

  get secretData(): CharacterSecretData {
    if (!this.isCharacterSecret(this.props.game.secretData)) throw new Error("This isn't character data!");
    return this.props.game.secretData;
  }

  confirmCharacter = (): void => {
    this.props.confirmCharacter();
    this.setState({ hasConfirmed: true });
  };

  isCharacterRound = (roundData: RoundData): roundData is CharacterRoundData => {
    return !!(roundData as CharacterRoundData).unconfirmedPlayerNames;
  };

  isCharacterSecret = (secretData: SecretData): secretData is CharacterSecretData => {
    return !!(secretData as CharacterSecretData).allegiance;
  };

  render(): JSX.Element {
    const roundData = this.isCharacterRound(this.props.game.roundData) && this.props.game.roundData;
    return (
      <Page>
        <Choose>
          <When condition={this.secretData && this.secretData.allegiance === 'resistance'}>
            <h2>You are part of the RESISTANCE!</h2>
          </When>
          <When condition={this.secretData.allegiance === 'spies'}>
            <h2>
              You are a <strong>SPY</strong>
            </h2>
            <p>The spies in this game are....</p>
            {this.secretData.spies.map((s, i) => (
              <strong key={`spy-${i}`}>{s}</strong>
            ))}
          </When>
        </Choose>
        <button disabled={this.state.hasConfirmed} onClick={this.confirmCharacter}>
          OK
        </button>
        <If condition={!!(this.state.hasConfirmed && this.props.game && roundData.unconfirmedPlayerNames)}>
          <p>Waiting for {listString(this.roundData.unconfirmedPlayerNames, 'and')} to confirm...</p>
        </If>
      </Page>
    );
  }
}
