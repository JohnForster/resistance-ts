import React, { PureComponent, Fragment } from 'react';

export interface HostPageProps {
  hostGame: (name: string) => void;
}

interface HostPageState {
  nameValue: string;
}

export default class HostPage extends PureComponent<HostPageProps, HostPageState> {
  handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({ nameValue: event.target.value });
  };

  handleSubmit = (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();
    this.props.hostGame(this.state.nameValue);
  };

  render(): JSX.Element {
    return (
      <Fragment>
        <h2>Host a new game</h2>
        Please enter your name:
        <input type="text" value={this.state.nameValue} onChange={this.handleChange} />
        <button onClick={this.handleSubmit} disabled={this.state.nameValue.length > 4}>
          Host
        </button>
      </Fragment>
    );
  }
}
