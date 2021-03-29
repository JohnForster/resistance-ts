import * as React from 'react';
import { GameData } from 'shared';
import styled from 'styled-components';
import { Columns } from '../../../components/columns/columns';
import { ContinueButton } from '../../../components/continueButton/continueButton';

interface Props {
  players: GameData['players'];
  leaderID: string;
  backToMenu: () => void;
}

const OrderContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
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
  console.log('TODO: Fill out PlayOrder');
  return (
    <>
      <h3>Play Order:</h3>
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
      <ContinueButton text={'Return to menu'} onClick={props.backToMenu} />
    </>
  );
};
