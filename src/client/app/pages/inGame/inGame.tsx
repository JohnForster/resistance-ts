import React, { PureComponent } from 'react';
import { GameData, RoundData, NominationRoundData } from '@shared/types/gameData';
import Page from '../../components/page/page';
import { PlayerContainer } from '../lobby/styled';
import NominateButton from '../../components/nominateButton/nominatebutton';

export interface InGamePageProps {
  game: GameData;
  submitNominations: (playerIDs: Set<string>) => void;
}

interface InGamePageState {
  selectedPlayers: Set<string>;
}

// ! REFACTOR INTO NOMINATION/VOTING ETC. COMPONENTS
export class InGamePage extends PureComponent<InGamePageProps, InGamePageState> {
  state: InGamePageState = {
    selectedPlayers: new Set<string>(),
  };

  onSelect = (playerID: string) => (): void => {
    const selectedPlayers = new Set(this.state.selectedPlayers);
    selectedPlayers.has(playerID) ? selectedPlayers.delete(playerID) : selectedPlayers.add(playerID);
    this.setState({ selectedPlayers });
  };

  get roundData(): NominationRoundData {
    if (!this.isNominationRound(this.props.game.roundData)) throw new Error("This isn't nomination round data!");
    return this.props.game.roundData;
  }

  get isCorrectNumberOfNominations(): boolean {
    return this.state.selectedPlayers.size === this.roundData.playersToNominate;
  }

  isNominationRound = (roundData: RoundData): roundData is NominationRoundData => {
    return !!(roundData as NominationRoundData).playersToNominate;
  };

  submit = (): void => {
    console.log('submitting...');
    console.log('this.isCorrectNumberOfNominations:', this.isCorrectNumberOfNominations);
    if (!this.isCorrectNumberOfNominations) return;
    this.props.submitNominations(this.state.selectedPlayers);
  };

  render(): JSX.Element {
    return (
      <Page>
        <Choose>
          <When condition={this.props.game.isLeader}>
            <h2>You are the leader!</h2>
            <h3>Mission No.{this.props.game.missionNumber}</h3>
            <h3>Nominate {this.roundData.playersToNominate} players to performthis mission.</h3>
            {this.props.game.players.map((player, i) => (
              <NominateButton
                key={`nominateButton-${i}`}
                name={player.name}
                select={this.onSelect(player.id)}
                isSelected={this.state.selectedPlayers.has(player.id)}
              />
            ))}
            <button onClick={this.submit} disabled={!this.isCorrectNumberOfNominations}>
              Submit
            </button>
          </When>
          <When condition={!this.props.game.isLeader}>
            <h2>
              Waiting for {this.props.game.leaderName} to nominate for Mission {this.props.game.missionNumber}...
            </h2>
          </When>
        </Choose>
      </Page>
    );
  }
}
