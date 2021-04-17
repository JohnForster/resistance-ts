import React from 'react';
import styled from 'styled-components';

export interface AssassinateButtonProps {
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

export const AssassinateButton: React.FC<AssassinateButtonProps> = (props) => {
  return (
    <Button onClick={props.select} name="selectTarget">
      <Side></Side>
      <Center>
        <span id="targetname">{`${props.name} `}</span>
      </Center>
      <Side>{props.isSelected ? ' 🔪 ' : '   '}</Side>
    </Button>
  );
};
