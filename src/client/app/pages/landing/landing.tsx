import React, { PureComponent, Fragment } from 'react';
import { PlayerData } from '../../../../shared/types/playerData';
import Page from '../../components/Page';

export interface LandingPageProps {
  hostGame: () => void;
  joinGame: (id: string) => void;
  testMessage: () => void;
  submitName: (name: string) => void;
  player: PlayerData;
}

interface LandingPageState {
  formValue: string;
  nameValue: string;
}

export class LandingPage extends PureComponent<LandingPageProps, LandingPageState> {
  state: LandingPageState = {
    formValue: '',
    nameValue: '',
  };

  handleClick = (): void => {};

  handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (this.state.formValue.length !== 5) return;
    this.props.joinGame(this.state.formValue.toUpperCase());
  };

  handleChange = (fieldName: 'formValue' | 'nameValue') => (event: React.ChangeEvent<HTMLInputElement>): void => {
    event.preventDefault();
    const newState = {};
    (newState as Pick<LandingPageState, typeof fieldName>)[fieldName] = event.target.value;
    this.setState(newState);
  };

  render(): JSX.Element {
    return (
      <Page>
        <h1>The Resistance</h1>
        <Choose>
          <When condition={!this.props.player.name}>
            <p>Enter your name!</p>
            <input type="text" value={this.state.nameValue} onChange={this.handleChange('nameValue')} />
            <br />
            <button onClick={(): void => this.props.submitName(this.state.nameValue)}>Join</button>
          </When>
          <Otherwise>
            <p>
              Welcome <span>{this.props.player.name}</span>
            </p>
            <button onClick={this.props.hostGame}>Host</button>
            <br />
            <p>Game Code:</p>
            <input type="text" value={this.state.formValue} onChange={this.handleChange('formValue')} />
            <button onClick={(): void => this.props.joinGame(this.state.formValue)}>Join</button>
          </Otherwise>
        </Choose>
      </Page>
    );
  }
}
