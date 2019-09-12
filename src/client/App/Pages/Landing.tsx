import React, { PureComponent, Fragment, ChangeEvent } from 'react';
import ClientPlayer from '../clientGame/clientPlayer';

export interface LandingPageProps {
  hostGame: () => void;
  joinGame: (id: string) => void;
  player: ClientPlayer;
}

interface LandingPageState {
  formValue: string;
}

export class LandingPage extends PureComponent<LandingPageProps, LandingPageState> {
  state: LandingPageState = {
    formValue: '',
  };

  handleClick = (): void => {};

  handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (this.state.formValue.length !== 5) return;
    this.props.joinGame(this.state.formValue.toUpperCase());
  };

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    this.setState({ formValue: event.target.value });
  };

  render(): JSX.Element {
    return (
      <div>
        <button onClick={this.handleClick}>Send Message</button>
        The Resistance
        <br />
        <button onClick={this.props.hostGame}>Host</button>
        <br />
        <form onSubmit={this.handleSubmit}>
          <label>
            Name:
            <input type="text" value={this.state.formValue} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>
        <button onClick={(): void => this.props.joinGame(this.props.player.id)}>Join</button>
      </div>
    );
  }
}
