import React, { PureComponent } from 'react';
import { GameData, CharacterSecretData, CharacterRoundData } from '../../../../shared/types/gameData';
import Page from '../../components/page/page';

export interface CharacterPageProps {
  confirmCharacter: () => void;
  game: GameData;
}

interface CharacterPageState {
  hasConfirmed: boolean;
}

export default class CharacterPage extends PureComponent<CharacterPageProps, CharacterPageState> {
  state: CharacterPageState = {
    hasConfirmed: false,
  };

  get secretData(): CharacterSecretData {
    return this.props.game.secretData;
  }

  get roundData(): CharacterRoundData {
    return this.props.game.roundData;
  }

  confirmCharacter = (): void => {
    this.props.confirmCharacter();
    this.setState({ hasConfirmed: true });
  };

  render(): JSX.Element {
    return (
      <Page>
        Character Confirmation Page
        <Choose>
          <When condition={this.secretData && this.secretData.allegiance === 'resistance'}>
            <h2>You are part of the RESISTANCE!</h2>
          </When>
          <When condition={this.props.game.secretData.allegiance === 'spies'}>
            <h2>
              You are a <strong>SPY</strong>
            </h2>
            <p>The spies in this game are....</p>
            {this.props.game.secretData.spies.map((s, i) => (
              <strong key={`spy-${i}`}>{s}</strong>
            ))}
          </When>
        </Choose>
        <button disabled={this.state.hasConfirmed} onClick={this.confirmCharacter}>
          OK
        </button>
        <If condition={this.state.hasConfirmed && this.props.game && this.props.game.roundData.unconfirmedPlayers}>
          <p>Waiting for {this.roundData && this.roundData.unconfirmedPlayers.join(', ')} to confirm...</p>
        </If>
      </Page>
    );
  }
}
