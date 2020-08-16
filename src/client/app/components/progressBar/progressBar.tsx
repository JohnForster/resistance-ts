import React, { Fragment } from 'react';
import styled from 'styled-components';

const BOX_SIZE_PX = 24;
const halfSize = BOX_SIZE_PX / 2;

const Line = styled.div<{ half?: boolean }>`
  height: ${halfSize}px;
  width: ${({ half }): number => (half ? halfSize : BOX_SIZE_PX)}px;
  border-bottom: 2px white solid;
`;

const Nominations = styled.div<{ selected: boolean }>`
  height: ${BOX_SIZE_PX}px;
  width: ${BOX_SIZE_PX}px;
  font-size: 18px;
  text-align: center;
  line-height: ${BOX_SIZE_PX}px;
  border-radius: 50%;
  border: 2px solid;
  border-color: ${({ selected }): string => (selected ? 'white' : 'transparent')};
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
  width: 100%;
`;

const Container = styled.div`
  width: 100%;
  color: white;
  padding-bottom: ${BOX_SIZE_PX}px;
`;

const RoundNumber = styled.div`
  font-size: 0.6em;
`;

interface Props {
  history: boolean[];
  rounds: [number, number][];
}

const ProgressBar: React.FC<Props> = props => {
  return (
    <Container>
      Mission Progress
      <ProgressContainer>
        <Line half />
        {props.rounds.map(([peopleOnMission, failsRequired], i) => {
          const result = props.history[i] === true ? ' ✊' : props.history[i] === false ? ' 💀' : undefined;
          const currentRoundIndex = props.history.length;
          return (
            <Fragment key={`line-${i}`}>
              <If condition={i !== 0}>
                <Line />
              </If>
              <Nominations selected={i === currentRoundIndex}>
                {result || peopleOnMission}
                <If condition={!result && failsRequired > 1}>
                  <FailsRequired>({failsRequired})</FailsRequired>
                </If>
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
