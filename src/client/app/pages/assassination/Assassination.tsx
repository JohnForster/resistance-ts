import * as React from 'react';
import { GameData } from 'shared';
import { Columns } from '../../components/columns/columns';
import { ContinueButton } from '../../components/continueButton/continueButton';
import Page from '../../components/page/page';
import { AssassinateButton } from './components/AssassinateButton';

interface Props {
  chooseTarget: (id: string) => void;
  game: GameData<'assassination'>;
}

export const AssassinationPage: React.FC<Props> = (props) => {
  const [assassinationTarget, setAssassinationTarget] = React.useState<{
    id: string;
    name: string;
  }>(null);
  const { resistance, spies } = props.game.roundData;
  return (
    <Page>
      <h2>The Resistance Have Completed Their Objective</h2>
      {props.game.characterInfo.character === 'Assassin' ? (
        <>
          <p>But you can still stop them!</p>
          <p>
            You are the Assassin. If you can correctly guess which player is
            Merlin, the spies will win the game.
          </p>
          <Columns
            items={resistance}
            mapFn={(player, i) => (
              <AssassinateButton
                name={player.name}
                isSelected={player.id === assassinationTarget?.id}
                select={() => setAssassinationTarget(player)}
                key={`assassinateButton-${i}`}
              >
                {player.name}
              </AssassinateButton>
            )}
          />
          <ContinueButton
            disabled={!assassinationTarget}
            onClick={() => props.chooseTarget(assassinationTarget.id)}
            name="confirmTarget"
            text={
              assassinationTarget
                ? `Assassinate ${assassinationTarget.name}`
                : 'Choose target'
            }
          />
        </>
      ) : props.game.characterInfo.allegiance === 'resistance' ? (
        <>
          <p>
            But this fight isn't over yet. If the Assassin can successfully
            deduce which player is Merlin, the spies will win the game!
          </p>
          <p>The spies in this game were...</p>
          {props.game.roundData.spies.map(({ name }, i) => (
            <span key={`${name}-${i}`}>{name}</span>
          ))}
          <h3>{props.game.roundData.assassin} is the Assassin</h3>
        </>
      ) : (
        <>
          <p>
            But there is one hope left! If the Assassin can successfully
            identify Merlin, the spies will win the game!
          </p>
          <h3>{props.game.roundData.assassin} is the Assassin</h3>
        </>
      )}
    </Page>
  );
};
