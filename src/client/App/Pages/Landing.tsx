import React, { PureComponent, Fragment, ChangeEvent } from 'react';
import { PlayerData } from '../../../shared/types/playerData';

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
      <Fragment>
        The Resistance
        <Choose>
          <When condition={!this.props.player.name}>
            Enter your name!
            <input type="text" value={this.state.nameValue} onChange={this.handleChange('nameValue')} />
            <button onClick={(): void => this.props.submitName(this.state.nameValue)}>Join</button>
          </When>
          <Otherwise>
            <button onClick={this.props.testMessage}>Send Message</button>
            <br />
            <button onClick={this.props.hostGame}>Host</button>
            <br />
            <form onSubmit={this.handleSubmit}>
              <label>
                Game Code:
                <input type="text" value={this.state.formValue} onChange={this.handleChange('formValue')} />
              </label>
            </form>
            <button onClick={(): void => this.props.joinGame(this.state.formValue)}>Join</button>
          </Otherwise>
        </Choose>
      </Fragment>
    );
  }
}
