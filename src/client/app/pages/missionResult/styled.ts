import styled, { css } from 'styled-components';
import responsive from '@client/app/helpers/responsive';

const timings: { [key: number]: number[] } = {
  2: [1.2, 2.6],
  3: [1, 2.2, 3.6],
  4: [0.8, 1.8, 3, 4.4],
  5: [0.6, 1.4, 2.4, 3.6, 5],
};

const slamAnimation = css`
  @keyframes slam {
    0% {
      transform: scale(20, 20);
      opacity: 0;
    }

    40% {
      opacity: 0;
    }

    100% {
      transform: scale(1, 1);

      opacity: 1;
    }
  }
`;

export const Results = styled.div`
  font-size: 72px;
  text-align: center;
  display: flex;
  ${(props: { votes: string[] }): string =>
    props.votes
      .map(
        (r, i, { length }) => `
          div:nth-child(${i + 1}) {
            animation-delay: ${timings[length][i]}s;
          }
        `,
      )
      .join('\n')}
`;

export const Result = styled.div`
  animation: slam 1s;
  animation-timing-function: ease-in;
  animation-fill-mode: both;
  ${slamAnimation}
`;

// eslint-disable-next-line
// @ts-ignore
export const OverallResult = styled.h1`
  // TODO add media query here
  ${responsive`
    font-size: ${[36, 48, 48]}px;
  `}

  animation: slam 1s;
  animation-timing-function: ease-in;
  animation-fill-mode: both;
  ${({ numOfVotes }: { numOfVotes: number }): string => `
    animation-delay: ${timings[numOfVotes][numOfVotes - 1] + 1}s;
  `}

  ${slamAnimation}
`;
