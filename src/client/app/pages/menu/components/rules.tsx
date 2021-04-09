import * as React from 'react';
import styled from 'styled-components';
import { Tabs } from '../../../components/tabs/tabs';
import responsive from '../../../helpers/responsive';

const Text = styled.p`
  ${responsive`
    font-size: ${[11, 15, 20]}px;
  `}

  strong {
    text-decoration: underline;
    font-size: larger;
  }
`;

const Container = styled.div`
  padding-top: 20px;
  width: 100%;
`;

export const RulesScreen: React.FC = () => {
  return (
    <Container>
      <Tabs titles={['Basic Rules', 'Characters']}>
        <>
          <Text>
            Two teams, Resistance and the Spies, first to three missions wins.
            The Resistance want to succeed the missions, the Spies want to
            sabotage them. The Resistance do not know who the spies are, but the
            spies know each other.
          </Text>
          <Text>
            Before each mission, one player is the "leader" and nominates people
            to go on the mission. The whole group votes on whether or not they
            think this mission should go ahead with the proposed team.
          </Text>
          <Text>
            The number of people on each mission is dependent on how many
            players there are, and how missions have already been completed. It
            (almost always) only takes one spy to sabotage a mission.
          </Text>
          <Text>
            If a nomination is voted down, the next player is the "leader", and
            they get to suggest a team. Each mission, the group have five tries
            to successfully nominate a team. If no agreement can be reached, the
            spies win the game.
          </Text>
        </>
        <>
          <Text>
            <strong>Merlin</strong> can see at the beginning of the game who the
            spies are, but at the end of the game, if the Spies can successfully
            work out which player is Merlin, they win.
          </Text>
          <Text>
            <strong>Percival</strong> knows who Merlin is, and so can use this
            information to help work out who the bad guys are, and to draw
            attention away from Merlin.
          </Text>
          <Text>
            <strong>Morgana</strong> appears to Percival alongside Merlin,
            making it harder for Percival to know who to trust.
          </Text>
          <Text>
            <strong>Mordred</strong> is hidden from Merlin, so Merlin does not
            have all the information.
          </Text>
          <Text>
            <strong>Oberon</strong> does not know who the other spies are, and
            they do not know who he is. Adding Oberon to the game makes it
            harder for the Spies to win.
          </Text>
          <Text>
            <strong>The Assassin</strong> has the final say on who the spies
            think is Merlin
          </Text>
        </>
      </Tabs>
    </Container>
  );
};
