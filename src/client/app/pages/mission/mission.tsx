import React, { PureComponent } from 'react';
import { Choose, Otherwise, When } from 'tsx-control-statements/components';

import {
  GameData,
  MissionRoundPublicData,
  MissionRoundSecretData,
} from '@shared/types/gameData';
import Page from '../../components/page/page';

import listString from '../../helpers/listString';
import { MissionButton } from '../../components/missionButton/missionButton';
import ProgressBar from '../../components/progressBar/progressBar';

export interface MissionPageProps {
  game: GameData<'mission'>;
  completeMission: (playerApproves: boolean) => void;
}

interface MissionPageState {
  voteToSucceed: boolean;
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
    return (
      <Page>
        <ProgressBar {...this.props.game} />
        <Choose>
          <When condition={this.playerIsOnMission}>
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
            <button onClick={this.submit} disabled={!this.secretData}>
              Submit
            </button>
          </When>
          <Otherwise>
            Waiting for
            <h3>
              {listString(this.roundData.nominatedPlayers.map((p) => p.name))}
            </h3>
            to complete the mission...
          </Otherwise>
        </Choose>
      </Page>
    );
  }
}
