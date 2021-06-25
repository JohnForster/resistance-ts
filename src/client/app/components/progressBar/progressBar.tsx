import React, { Fragment } from 'react';
import { ClientGameHistory } from 'shared';

import responsive from '../../helpers/responsive';
import styled from '../../styles/themed-styled-components';

const scale = (f: number) => (x: number): number => x * f;
const BOX_SIZE_PX = [24, 30, 56];
const HALF_SIZE = BOX_SIZE_PX.map(scale(0.5));
const FONT_SIZES = BOX_SIZE_PX.map(scale(0.8));
const BORDER_WEIGHT = [2, 2, 4];

const Line = styled.div<{ half?: boolean }>`
  --progress-bar: ${({ theme }) => theme.colours.progressBar};
  ${({ half }): string => responsive`
    width: ${half ? HALF_SIZE : BOX_SIZE_PX}px;
    height: ${HALF_SIZE}px;
    border-bottom: ${BORDER_WEIGHT}px var(--progress-bar) solid;
  `}
`;

const Nominations = styled.div<{ selected: boolean }>`
  --progress-bar: ${({ theme }) => theme.colours.progressBar};

  ${responsive`
    height: ${BOX_SIZE_PX}px;
    width: ${BOX_SIZE_PX}px;
    line-height: ${BOX_SIZE_PX}px;
    font-size: ${FONT_SIZES}px;
    border-width: ${BORDER_WEIGHT}px;
  `}
  text-align: center;
  border-style: solid;
  border-radius: 50%;
  border-color: transparent;

  @keyframes glow {
    from {
      border-color: var(--progress-bar);
      box-shadow: 0 0 20px var(--progress-bar);
    }
    to {
      border-color: var(--progress-bar);
      box-shadow: 0 0 0px var(--progress-bar);
    }
  }
  ${({ selected }): string =>
    selected && 'animation: 1s ease-in infinite alternate glow;'};
`;

const FailsRequired = styled.sup`
  line-height: 0;
  font-size: 0.63em;
  vertical-align: super;
  color: yellow;
`;

const ProgressContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: -0.5rem;
  width: 100%;
`;

const Container = styled.div`
  width: 100%;
  color: white;
  ${responsive`
    padding-bottom: ${BOX_SIZE_PX}px;
  `}
`;

const RoundNumber = styled.div`
  font-size: 0.6em;
`;

interface Props {
  history: ClientGameHistory;
  rounds: [number, number][];
}

const ProgressBar: React.FC<Props> = (props) => {
  const resultArray = props.history.pastMissions.sort((a, b) => a.missionNumber - b.missionNumber).map((m) => m.succeeded);
  return (
    <Container>
      <h3>Mission Progress</h3>
      <ProgressContainer>
        <Line half />
        {props.rounds.map(([peopleOnMission, failsRequired], i) => {
          const result =
            resultArray[i] === true
              ? ' ✊'
              : resultArray[i] === false
              ? ' 💀'
              : undefined;
          const currentRoundIndex = resultArray.length;
          const showFailsRequired = !result && failsRequired > 1;
          return (
            <Fragment key={`line-${i}`}>
              {i !== 0 && <Line />}
              <Nominations
                selected={i === currentRoundIndex}
                id={i === currentRoundIndex ? 'currentround' : ''}
              >
                {result || peopleOnMission}
                {showFailsRequired && (
                  <FailsRequired>({failsRequired})</FailsRequired>
                )}
                <RoundNumber>{i + 1}</RoundNumber>
              </Nominations>
            </Fragment>
          );
        })}
        <Line half />
      </ProgressContainer>
    </Container>
  );
};

export default ProgressBar;
