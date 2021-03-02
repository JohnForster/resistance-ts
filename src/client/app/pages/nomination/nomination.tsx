import React, { PureComponent } from 'react';
import {
  GameData,
  NominationRoundPublicData,
  RoundData,
} from '@shared/types/gameData';
import Page from '../../components/page/page';
import ProgressBar from '../../components/progressBar/progressBar';
import { PlayerContainer } from '../lobby/styled';
import NominateButton from '../../components/nominateButton/nominatebutton';

export interface NominationPageProps {
  game: GameData<'nomination'>;
  submitNominations: (playerIDs: Set<string>) => void;
}

interface NominationPageState {
  selectedPlayers: Set<string>;
}
const rounds: [number, number][] = [
  [3, 1],
  [4, 1],
  [4, 1],
  [5, 2],
  [5, 1],
];

const mockRound = {
  history: [true, false],
  rounds,
};

export class NominationPage extends PureComponent<
  NominationPageProps,
  NominationPageState
> {
  state: NominationPageState = {
    selectedPlayers: new Set<string>(),
  };

  onSelect = (playerID: string) => (): void => {
    const selectedPlayers = new Set(this.state.selectedPlayers);
    selectedPlayers.has(playerID)
      ? selectedPlayers.delete(playerID)
      : selectedPlayers.add(playerID);
    this.setState({ selectedPlayers });
  };

  get roundData(): NominationRoundPublicData {
    return this.props.game.roundData;
  }

  get isCorrectNumberOfNominations(): boolean {
    return this.state.selectedPlayers.size === this.roundData.playersToNominate;
  }

  submit = (): void => {
    console.log('submitting...');
    console.log(
      'this.isCorrectNumberOfNominations:',
      this.isCorrectNumberOfNominations,
    );
    if (!this.isCorrectNumberOfNominations) return;
    this.props.submitNominations(this.state.selectedPlayers);
  };

  render(): JSX.Element {
    return (
      <Page>
        <ProgressBar
          history={this.props.game.history}
          rounds={this.props.game.rounds}
        />
        <Choose>
          <When condition={this.props.game.isLeader}>
            <h2>You are the leader!</h2>
            <h3>
              Nominate {this.roundData.playersToNominate} players to perform
              this mission.
            </h3>
            {this.props.game.players.map((player, i) => (
              <NominateButton
                key={`nominateButton-${i}`}
                name={player.name}
                select={this.onSelect(player.id)}
                isSelected={this.state.selectedPlayers.has(player.id)}
              />
            ))}
            <button
              onClick={this.submit}
              disabled={!this.isCorrectNumberOfNominations}
            >
              Submit
            </button>
          </When>
          <When condition={!this.props.game.isLeader}>
            <h2>
              Waiting for {this.props.game.leaderName} to nominate for Mission{' '}
              {this.props.game.missionNumber}...
            </h2>
          </When>
        </Choose>
      </Page>
    );
  }
}
