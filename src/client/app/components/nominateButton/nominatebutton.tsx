import React, { Fragment } from 'react';
import * as Styled from './styled';

export interface NominateButtonProps {
  name: string;
  isSelected: boolean;
  select: () => void;
}

interface NominateButtonState {}

const NominateButton = (props: Readonly<NominateButtonProps>): JSX.Element => {
  return (
    <>
      <Styled.button onClick={props.select} name="nominatebutton">
        <Styled.Side />
        <Styled.Center>
          <span id="nominatename">{`${props.name} `}</span>
        </Styled.Center>
        <Styled.Side>{props.isSelected ? ' ✅ ' : ' 🚫 '}</Styled.Side>
      </Styled.button>
    </>
  );
};

export default NominateButton;
