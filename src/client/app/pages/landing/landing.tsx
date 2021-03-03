import React, { PureComponent } from 'react';
import { Choose, Otherwise, When } from 'tsx-control-statements/components';

import { PlayerData } from '@shared/types/playerData';
import Page from '../../components/page/page';

export interface LandingPageProps {
  hostGame: () => void;
  joinGame: (id: string) => void;
  submitName: (name: string) => void;
  player: PlayerData;
}

interface LandingPageState {
  formValue: string;
  nameValue: string;
}

export class LandingPage extends PureComponent<
  LandingPageProps,
  LandingPageState
> {
  state: LandingPageState = {
    formValue: '',
    nameValue: '',
  };

  componentDidMount(): void {
    document.getElementById('nameInput').focus();
  }

  handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (this.state.formValue.length !== 5) return;
    this.props.joinGame(this.state.formValue.toUpperCase());
  };

  handleChange = (fieldName: 'formValue' | 'nameValue') => (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    event.preventDefault();
    const newValue =
      fieldName === 'formValue'
        ? event.target.value.toUpperCase()
        : event.target.value;
    const newState = { [fieldName]: newValue } as Pick<
      LandingPageState,
      typeof fieldName
    >;
    this.setState(newState);
  };

  render(): JSX.Element {
    return (
      <Page>
        <h1>The Resistance</h1>
        <Choose>
          <When condition={!this.props.player.name}>
            <p>Enter your name!</p>
            <input
              id="nameInput"
              type="text"
              value={this.state.nameValue}
              onChange={this.handleChange('nameValue')}
            />
            <br />
            <button
              onClick={(): void => this.props.submitName(this.state.nameValue)}
            >
              Enter Name
            </button>
          </When>
          <Otherwise>
            <p>
              Welcome <span>{this.props.player.name}</span>
            </p>
            <button onClick={this.props.hostGame}>Host Game</button>
            <br />
            <p>Game Code:</p>
            <input
              type="text"
              value={this.state.formValue}
              onChange={this.handleChange('formValue')}
            />
            <button
              onClick={(): void => this.props.joinGame(this.state.formValue)}
            >
              Join Game
            </button>
          </Otherwise>
        </Choose>
      </Page>
    );
  }
}
