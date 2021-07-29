import React, { PureComponent } from 'react';

import { PlayerData } from 'shared';
import Page from '../../components/page/page';

export interface LandingPageProps {
  hostGame: () => void;
  joinGame: (id: string) => void;
  submitName: (name: string) => void;
  player: PlayerData;
}

interface LandingPageState {
  gameCode: string;
  playerName: string;
  changingName: boolean;
}

export class LandingPage extends PureComponent<
  LandingPageProps,
  LandingPageState
> {
  state: LandingPageState = {
    gameCode: '',
    playerName: '',
    changingName: false,
  };

  componentDidMount(): void {
    document.getElementById('nameInput')?.focus();
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    this.setState({playerName: event.target.value});
  }

  handleGameCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const code = event.target.value.trim().toUpperCase()
    if (code.length > 3) {
      return
    }
    this.setState({gameCode: event.target.value.toUpperCase()});
  }

  submitName = () => {
    this.props.submitName(this.state.playerName)
    this.setState({changingName: false})
  }

  render(): JSX.Element {
    return (
      <Page>
        <h1>The Resistance</h1>
        {this.state.changingName || !this.props.player.name ? (
          <>
            <p>Enter your name!</p>
            <input
              id="nameInput"
              type="text"
              value={this.state.playerName}
              onChange={this.handleNameChange}
            />
            <br />
            <button
              onClick={this.submitName}
            >
              Enter Name
            </button>
          </>
        ) : (
          <>
            <p>
              Welcome <span>{this.props.player.name}</span>
            </p>
            <button onClick={this.props.hostGame}>Host Game</button>
            <br />
            <p>Game Code:</p>
            <input
              type="text"
              name="gamecode"
              value={this.state.gameCode}
              onChange={this.handleGameCodeChange}
            />
            <button
              onClick={(): void => this.props.joinGame(this.state.gameCode)}
            >
              Join Game
            </button>
            <p role="button" style={{textDecoration: 'underline'}} onClick={() => this.setState({changingName: true})}>Edit name</p>
          </>
        )}
      </Page>
    );
  }
}
