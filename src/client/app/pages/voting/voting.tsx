import React, { useState } from 'react';
import { GameData } from '@shared/types/gameData';
import { Choose, Otherwise, When } from 'tsx-control-statements/components';

import Page from '../../components/page/page';
import listString from '../../helpers/listString';
import ProgressBar from '../../components/progressBar/progressBar';

import * as Styled from './styled';
interface Props {
  game: GameData<'voting'>;
  submitVote: (playerApproves: boolean) => void;
}

export const VotingPage: React.FC<Props> = (props) => {
  const [playerApproves, setPlayerApproves] = useState<boolean>(null);
  const { roundData, secretData } = props.game;
  return (
    <Page>
      <ProgressBar history={props.game.history} rounds={props.game.rounds} />
      <h3>{props.game.leaderName} has nominated</h3>
      <h2>{listString(roundData.nominatedPlayers.map((p) => p.name))}</h2>
      <h3>
        to undertake this mission. Do you think this mission should go ahead?
      </h3>
      <Choose>
        <When condition={!!secretData}>
          {/* When the player has already made a decision. */}
          <Styled.ThumbContainer>
            {props.game.secretData.playerApproves ? '👍' : '👎'}
          </Styled.ThumbContainer>
          <p>Waiting for {listString(roundData.unconfirmedPlayerNames)}</p>
        </When>
        <Otherwise>
          <Styled.ButtonContainer>
            <Styled.VoteButton
              onClick={(): void => setPlayerApproves(true)}
              isGreyed={playerApproves === false}
            >
              👍
            </Styled.VoteButton>
            <Styled.VoteButton
              onClick={(): void => setPlayerApproves(false)}
              isGreyed={playerApproves === true}
            >
              👎
            </Styled.VoteButton>
          </Styled.ButtonContainer>
          <button
            disabled={playerApproves === null}
            onClick={() => props.submitVote(playerApproves)}
          >
            Submit
          </button>
        </Otherwise>
      </Choose>
    </Page>
  );
};

// export interface VotingPageProps {
//   game: GameData;
//   submitVote: (playerApproves: boolean) => void;
// }

// interface VotingPageState {
//   playerApproves: boolean;
// }

// // ! REFACTOR INTO NOMINATION/VOTING ETC. COMPONENTS
// export class old_VotingPage extends PureComponent<
//   VotingPageProps,
//   VotingPageState
// > {
//   state: VotingPageState = {
//     playerApproves: null,
//   };

//   get roundData(): VotingRoundPublicData {
//     const roundData = this.props.game.roundData;
//     if (!this.isVotingRound(this.props.game))
//       throw new Error("This isn't voting round data!");
//     return this.props.game.roundData;
//   }

//   get secretData(): VotingRoundSecretData {
//     if (!this.isVotingRoundSecret(this.props.game.secretData)) return null;
//     return this.props.game.secretData;
//   }

//   isVotingRound = (
//     roundData: PublicDataByName<RoundName>,
//   ): roundData is PublicDataByName<'voting'> => {
//     return !!(gameData.roundName === 'voting');
//   };

//   isVotingRoundSecret = (
//     secretData: SecretData,
//   ): secretData is VotingRoundSecretData => {
//     if (!secretData) return false;
//     const playerApproves = (secretData as VotingRoundSecretData).playerApproves;
//     return !!(playerApproves === true || playerApproves === false);
//   };

//   approve = (playerApproves: boolean): void => {
//     this.setState({ playerApproves });
//   };

//   submit = (): void => {
//     this.props.submitVote(this.state.playerApproves);
//   };

//   render(): JSX.Element {
//     return (
//       <Page>
//         <ProgressBar
//           history={this.props.game.history}
//           rounds={this.props.game.rounds}
//         />
//         <h3>{this.props.game.leaderName} has nominated</h3>
//         <h2>
//           {listString(this.roundData.nominatedPlayers.map((p) => p.name))}
//         </h2>
//         <h3>
//           to undertake this mission. Do you think this mission should go ahead?
//         </h3>
//         <Choose>
//           <When condition={!!this.secretData}>
//             {/* When the player has already made a decision. */}
//             <Styled.ThumbContainer>
//               {this.secretData.playerApproves ? '👍' : '👎'}
//             </Styled.ThumbContainer>
//             <p>
//               Waiting for {listString(this.roundData.unconfirmedPlayerNames)}
//             </p>
//           </When>
//           <Otherwise>
//             <Styled.ButtonContainer>
//               <Styled.VoteButton
//                 onClick={(): void => this.approve(true)}
//                 isGreyed={this.state.playerApproves === false}
//               >
//                 👍
//               </Styled.VoteButton>
//               <Styled.VoteButton
//                 onClick={(): void => this.approve(false)}
//                 isGreyed={this.state.playerApproves === true}
//               >
//                 👎
//               </Styled.VoteButton>
//             </Styled.ButtonContainer>
//             <button
//               disabled={this.state.playerApproves === null}
//               onClick={this.submit}
//             >
//               Submit
//             </button>
//           </Otherwise>
//         </Choose>
//       </Page>
//     );
//   }
// }
