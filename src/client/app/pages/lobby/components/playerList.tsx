import * as React from 'react';
import styled from 'styled-components';
import { GameData } from 'shared';

import { Columns } from '../../../components/columns/columns';

export const PlayerContainer = styled.div`
  flex: 1;
`;

interface Props {
  game: GameData<'lobby'>;
}

export const PlayerList: React.FC<Props> = ({ game }) => {
  return (
    <PlayerContainer>
      <Columns
        items={game.players}
        mapFn={(player) => <p key={`playerName-${player.id}`}>{player.name}</p>}
      />
    </PlayerContainer>
  );
};
