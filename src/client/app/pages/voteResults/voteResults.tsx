import React from 'react';
import { GameData } from '@shared/types/gameData';

interface VoteResultsProps {
  game: GameData;
  confirmReady: () => void;
}

export const VoteResultsPage: React.FC<VoteResultsProps> = props => (
  <>
    <div>Vote Results</div>
    <input type="button" onClick={props.confirmReady}>
      Ready
    </input>
  </>
);
