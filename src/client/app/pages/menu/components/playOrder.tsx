import * as React from 'react';
import { GameData } from 'shared';
import styled from 'styled-components';
import { Columns } from '../../../components/columns/columns';
import { ContinueButton } from '../../../components/continueButton/continueButton';

interface Props {
  players: GameData['players'];
  leaderID: string;
}

const OrderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: baseline;
  padding: 1rem 0;
`;

const Name = styled.div`
  display: flex;
  align-items: baseline;
`;

const Crown = styled.div`
  width: 0;
  padding-left: 10px;
`;

export const PlayOrder: React.FC<Props> = (props) => {
  return (
    <>
      <h2>Play Order:</h2>
      <OrderContainer>
        <Columns
          items={props.players}
          mapFn={({ name, id }, i) => (
            <Name key={`playerOrder-${id.slice(0, 6)}`}>
              {`${i + 1}.  ${name}`}
              {id === props.leaderID && <Crown>{'👑'}</Crown>}
            </Name>
          )}
          forceSingle
        />
      </OrderContainer>
    </>
  );
};
