import sortBy from 'lodash/sortBy';
import * as React from 'react';
import { ClientGameHistory } from 'shared';
import styled from 'styled-components';
import listString from '../../../helpers/listString';

interface Props {
  history: ClientGameHistory;
}

const Container = styled.div``;
const MissionContainer = styled.div`
  display: flex;
  & > * {
    flex: 1;
  }
`;

const Big = styled.p`
  flex: 2;
`;

const Leader = styled.p`
  flex: 1;
  text-decoration: underline;
`;

const Small = styled.p`
  flex-grow: 0;
  flex-shrink: 0;
`;

export const HistoryScreen: React.FC<Props> = (props) => {
  const pastMissions = sortBy(
    props.history.pastMissions,
    (mission) => mission.missionNumber,
  );
  return (
    <Container>
      <h2>Missions</h2>
      {pastMissions.map((mission) => (
        <MissionContainer>
          <Small>{mission.missionNumber}.</Small>
          <Small>{mission.succeeded ? '✊' : '💀'}</Small>
          <Leader>{mission.leader}:</Leader>
          <Big>{mission.team.join(', ')}</Big>
        </MissionContainer>
      ))}
    </Container>
  );
};
