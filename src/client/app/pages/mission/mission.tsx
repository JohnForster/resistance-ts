import React, { PureComponent } from 'react';
import { GameData, RoundData, SecretData, MissionRoundData, MissionRoundSecretData } from '@shared/types/gameData';
import Page from '../../components/page/page';

import listString from '../../helpers/listString';
import * as Styled from '../../components/missionButton/styled';
import { MissionButton } from '../../components/missionButton/missionButton';

export interface MissionPageProps {
  game: GameData;
  completeMission: (playerApproves: boolean) => void;
}

interface MissionPageState {
  voteToSucceed: boolean;
}

export class MissionPage extends PureComponent<MissionPageProps, MissionPageState> {
  state: MissionPageState = {
    voteToSucceed: null,
  };

  get roundData(): MissionRoundData {
    if (!this.isMissionRound(this.props.game.roundData)) throw new Error("This isn't nomination round data!");
    return this.props.game.roundData;
  }

  get secretData(): MissionRoundSecretData {
    if (!this.isMissionRoundSecret(this.props.game.secretData)) return null;
    return this.props.game.secretData;
  }

  get playerIsOnMission(): boolean {
    return !!this.roundData.nominatedPlayers.find(p => p.id === this.props.game.playerID);
  }

  isMissionRound = (roundData: RoundData): roundData is MissionRoundData => {
    return !!((roundData as MissionRoundData).roundName === 'mission');
  };

  isMissionRoundSecret = (secretData: SecretData): secretData is MissionRoundSecretData => {
    if (!secretData) return false;
    const playerApproves = (secretData as MissionRoundSecretData).hasVoted;
    return !!(playerApproves === true || playerApproves === false);
  };

  makeDecision = (voteToSucceed: boolean): void => {
    this.setState({ voteToSucceed });
  };

  submit = (): void => {
    this.props.completeMission(this.state.voteToSucceed);
  };

  render(): JSX.Element {
    return (
      <Page>
        <h1>Mission No.{this.props.game.missionNumber}</h1>
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
            <button onClick={this.submit}>Submit</button>
          </When>
          <Otherwise>
            Waiting for
            <h3>{listString(this.roundData.nominatedPlayers.map(p => p.name))}</h3>
            to complete the mission...
          </Otherwise>
        </Choose>
      </Page>
    );
  }
}
