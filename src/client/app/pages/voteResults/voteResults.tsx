import React from 'react';
import { GameData } from '@shared/types/gameData';

interface VoteResultsProps {
  game: GameData<'votingResult'>;
  confirmReady: () => void;
}

export const VoteResultsPage: React.FC<VoteResultsProps> = (props) => (
  <>
    <div>Vote Results</div>
    <button onClick={props.confirmReady}>Ready</button>
  </>
);
