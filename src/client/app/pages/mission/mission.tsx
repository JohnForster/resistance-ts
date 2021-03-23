import React, { PureComponent } from 'react';

import {
  GameData,
  MissionRoundPublicData,
  MissionRoundSecretData,
} from '@shared/types/gameData';
import Page from '../../components/page/page';

import listString from '../../helpers/listString';
import { MissionButton } from '../../components/missionButton/missionButton';
import ProgressBar from '../../components/progressBar/progressBar';
import styled from 'styled-components';

const MissionButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

export interface MissionPageProps {
  game: GameData<'mission'>;
  completeMission: (playerApproves: boolean) => void;
}

interface MissionPageState {
  voteToSucceed: boolean | null;
}

export class MissionPage extends PureComponent<
  MissionPageProps,
  MissionPageState
> {
  state: MissionPageState = {
    voteToSucceed: null,
  };

  get roundData(): MissionRoundPublicData {
    return this.props.game.roundData;
  }

  get secretData(): MissionRoundSecretData {
    return this.props.game.secretData;
  }

  get playerIsOnMission(): boolean {
    return !!this.roundData.nominatedPlayers.find(
      (p) => p.id === this.props.game.playerID,
    );
  }

  makeDecision = (voteToSucceed: boolean): void => {
    this.setState({ voteToSucceed });
  };

  submit = (): void => {
    this.props.completeMission(this.state.voteToSucceed);
  };

  render(): JSX.Element {
    const hasVoted = this.secretData.votedToSucceed !== undefined;
    return (
      <Page>
        <ProgressBar {...this.props.game} />
        {this.playerIsOnMission ? (
          <>
            <MissionButtonsContainer>
              <MissionButton
                icon={'✊'}
                text={'Success'}
                isSelected={this.state.voteToSucceed === true}
                onClick={(): void => this.makeDecision(true)}
              />
              <MissionButton
                icon={'💀'}
                text={'Fail'}
                isSelected={this.state.voteToSucceed === false}
                onClick={(): void => this.makeDecision(false)}
              />
            </MissionButtonsContainer>
            <button
              onClick={this.submit}
              disabled={
                this.state.voteToSucceed === null ||
                (hasVoted &&
                  this.secretData.votedToSucceed === this.state.voteToSucceed)
              }
            >
              {!hasVoted
                ? 'Submit'
                : this.secretData.votedToSucceed === this.state.voteToSucceed
                ? 'Submitted'
                : 'Resubmit'}
            </button>
          </>
        ) : (
          <>
            Waiting for
            <h3>
              {listString(this.roundData.nominatedPlayers.map((p) => p.name))}
            </h3>
            to complete the mission...
          </>
        )}
      </Page>
    );
  }
}
