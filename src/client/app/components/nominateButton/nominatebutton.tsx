import React from 'react';
import styled from 'styled-components';
import responsive from '../../helpers/responsive';

export interface NominateButtonProps {
  name: string;
  isSelected: boolean;
  select: () => void;
}

export const Button = styled.button`
  width: 100%;
  min-width: 47%;
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 340px;
  ${responsive`
    margin-top: ${[5, 5, 8]}px;
    margin-bottom: ${[5, 5, 8]}px;
    padding: ${[1, 5, 8]}px ${[5, 5, 8]}px;
  `}
`;

export const Side = styled.div`
  flex: 1;
  text-align: right;
  margin: 0 5px;
`;

export const Center = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const NominateButton = (props: Readonly<NominateButtonProps>): JSX.Element => {
  return (
    <Button onClick={props.select} name="nominatebutton">
      <Side></Side>
      <Center>
        <span id="nominatename">{`${props.name} `}</span>
      </Center>
      <Side>{props.isSelected ? ' ✅ ' : ' 🚫 '}</Side>
    </Button>
  );
};

export default NominateButton;
