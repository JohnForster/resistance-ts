import React, { PureComponent } from 'react';

import { GameData, NominationRoundPublicData } from 'shared';
import Page from '../../components/page/page';
import ProgressBar from '../../components/progressBar/progressBar';
import NominateButton from '../../components/nominateButton/nominatebutton';
import styled from 'styled-components';
import { ContinueButton } from '../../components/continueButton/continueButton';
import { Columns } from '../../components/columns/columns';

export interface NominationPageProps {
  game: GameData<'nomination'>;
  submitNominations: (playerIDs: Set<string>) => void;
}

interface NominationPageState {
  selectedPlayers: Set<string>;
}

const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  flex-wrap: wrap;
  overflow: hidden;
  column-gap: 1rem;
`;

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
    if (!this.isCorrectNumberOfNominations) return;
    this.props.submitNominations(this.state.selectedPlayers);
  };

  render(): JSX.Element {
    const leaderName = this.props.game.players.find(
      (p) => p.id === this.props.game.leaderID,
    )?.name;
    return (
      <Page>
        <ProgressBar
          history={this.props.game.history}
          rounds={this.props.game.rounds}
        />
        {this.props.game.isLeader ? (
          <>
            <h2>You are the leader!</h2>
            <h3>
              Nominate {this.roundData.playersToNominate} players to perform
              this mission.
            </h3>
            <Container>
              <Columns
                items={this.props.game.players}
                mapFn={(player, i) => (
                  <NominateButton
                    key={`nominateButton-${i}`}
                    name={player.name}
                    select={this.onSelect(player.id)}
                    isSelected={this.state.selectedPlayers.has(player.id)}
                  />
                )}
              />
            </Container>
            <ContinueButton
              text="Submit"
              onClick={this.submit}
              disabled={!this.isCorrectNumberOfNominations}
            >
              Submit
            </ContinueButton>
          </>
        ) : (
          <h2>
            Waiting for {leaderName} to nominate for Mission{' '}
            {this.props.game.missionNumber}...
          </h2>
        )}
      </Page>
    );
  }
}
