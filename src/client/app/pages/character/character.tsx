import React, { PureComponent, Fragment } from 'react';
import { GameData } from '../../../../shared/types/gameData';

export interface CharacterPageProps {
  confirmCharacter: () => void;
  game: GameData;
}

interface CharacterPageState {}

export default class CharacterPage extends PureComponent<CharacterPageProps, CharacterPageState> {
  render(): JSX.Element {
    return (
      <Fragment>
        <Choose>
          <When condition={this.props.game.secretData.character === 'resistance'}>
            <h2>You are part of the RESISTANCE!</h2>
          </When>
          <When condition={this.props.game.secretData.character === 'spy'}>
            <h2>
              You are a <strong>SPY</strong>
            </h2>
            <p>The spies in this game are....</p>
            {this.props.game.secretData.spies.map((s, i) => (
              <strong key={`spy-${i}`}>{s}</strong>
            ))}
          </When>
        </Choose>
        <button onClick={this.props.confirmCharacter}>OK</button>
      </Fragment>
    );
  }
}
