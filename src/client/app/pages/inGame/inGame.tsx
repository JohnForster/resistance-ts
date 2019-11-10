import React, { PureComponent } from 'react';
import { GameData, RoundData, NominationRoundData } from '../../../../shared/types/gameData';
import Page from '../../components/page/page';
import { PlayerContainer } from '../lobby/styled';
import NominateButton from '../../components/nominateButton/nominatebutton';

export interface InGamePageProps {
  game: GameData;
}

interface InGamePageState {}

// ! REFACTOR INTO NOMINATION/VOTING ETC. COMPONENTS
export default class InGamePage extends PureComponent<InGamePageProps, InGamePageState> {
  state = {
    selectedPlayers: new Array(this.props.game.players.length).fill(false),
  };

  onSelect = (index: number) => (): void => {
    const selectedPlayers = [...this.state.selectedPlayers];
    selectedPlayers[index] = !selectedPlayers[index];
    this.setState({ selectedPlayers });
  };

  get roundData(): NominationRoundData {
    if (!this.isNominationRound(this.props.game.roundData)) throw new Error("This isn't nomination round data!");
    return this.props.game.roundData;
  }

  get isCorrectNumberOfNominations(): boolean {
    return this.state.selectedPlayers.length === this.roundData.playersToNominate;
  }

  isNominationRound = (roundData: RoundData): roundData is NominationRoundData => {
    return !!(roundData as NominationRoundData).playersToNominate;
  };

  submitNames = (): void => {};

  render(): JSX.Element {
    return (
      <Page>
        <Choose>
          <When condition={this.props.game.isLeader}>
            <h2>You are the leader!</h2>
            <h3>
              Mission No.{this.props.game.round}. Nominate {this.roundData.playersToNominate} players to perform this
              mission.
            </h3>
            {this.props.game.players.map((player, i) => (
              <NominateButton
                key={`nominateButton-${i}`}
                name={player.name}
                select={this.onSelect(i)}
                isSelected={this.state.selectedPlayers[i]}
              />
            ))}
            <button onClick={this.submitNames} disabled={!this.isCorrectNumberOfNominations}>
              Submit
            </button>
          </When>
          <When condition={!this.props.game.isLeader}>
            <h2>
              Waiting for {this.props.game.leaderName} to nominate for Mission {this.props.game.round}...
            </h2>
          </When>
        </Choose>
        <br />
        <ul>
          {Object.entries(this.props.game).map(([key, value], i) => (
            <li key={`item-${i}`}>
              <strong>{key}:</strong> {JSON.stringify(value)}
            </li>
          ))}
        </ul>
      </Page>
    );
  }
}
