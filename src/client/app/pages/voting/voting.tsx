import React, { PureComponent } from 'react';
import { GameData, RoundData, SecretData, VotingRoundData, VotingRoundSecretData } from '@shared/types/gameData';
import Page from '../../components/page/page';
import { PlayerContainer } from '../lobby/styled';
import NominateButton from '../../components/nominateButton/nominatebutton';
import * as Styled from './styled';

import listString from '../../helpers/listString';

export interface VotingPageProps {
  game: GameData;
  submitVote: (playerApproves: boolean) => void;
}

interface VotingPageState {
  playerApproves: boolean;
}

// ! REFACTOR INTO NOMINATION/VOTING ETC. COMPONENTS
export class VotingPage extends PureComponent<VotingPageProps, VotingPageState> {
  state: VotingPageState = {
    playerApproves: null,
  };

  get roundData(): VotingRoundData {
    if (!this.isVotingRound(this.props.game.roundData)) throw new Error("This isn't nomination round data!");
    return this.props.game.roundData;
  }

  get secretData(): VotingRoundSecretData {
    if (!this.isVotingRoundSecret(this.props.game.secretData)) return null;
    return this.props.game.secretData;
  }

  isVotingRound = (roundData: RoundData): roundData is VotingRoundData => {
    return !!((roundData as VotingRoundData).roundName === 'voting');
  };

  isVotingRoundSecret = (secretData: SecretData): secretData is VotingRoundSecretData => {
    if (!secretData) return false;
    const playerApproves = (secretData as VotingRoundSecretData).playerApproves;
    return !!(playerApproves === true || playerApproves === false);
  };

  approve = (playerApproves: boolean): void => {
    this.setState({ playerApproves });
  };

  submit = (): void => {
    this.props.submitVote(this.state.playerApproves);
  };

  render(): JSX.Element {
    console.log(this.secretData);
    return (
      <Page>
        <h1>Mission No.{this.props.game.missionNumber}</h1>
        <h3>{this.props.game.leaderName} has nominated</h3>
        {/* {this.roundData.nominatedPlayers.map((p, i) => (
          <p key={`nominatedPlayer-${i}`}>{p.name}</p>
        ))} */}
        <h2>{listString(this.roundData.nominatedPlayers.map(p => p.name))}</h2>
        <h3>to undertake this mission. Do you think this mission should go ahead?</h3>
        <Choose>
          <When condition={!!this.secretData}>
            {/* When the player has already made a decision. */}
            <Styled.ThumbContainer>{this.secretData.playerApproves ? '👍' : '👎'}</Styled.ThumbContainer>
            <p>Waiting for {listString(this.roundData.unconfirmedPlayerNames)}</p>
          </When>
          <Otherwise>
            <Styled.ButtonContainer>
              <Styled.VoteButton
                onClick={(): void => this.approve(true)}
                isGreyed={this.state.playerApproves === false}
              >
                👍
              </Styled.VoteButton>
              <Styled.VoteButton
                onClick={(): void => this.approve(false)}
                isGreyed={this.state.playerApproves === true}
              >
                👎
              </Styled.VoteButton>
            </Styled.ButtonContainer>
            <button disabled={this.state.playerApproves === null} onClick={this.submit}>
              Submit
            </button>
          </Otherwise>
        </Choose>
      </Page>
    );
  }
}
