import React from 'react';
import * as Styled from './styled';

export const MissionButton = ({
  icon,
  text,
  isSelected,
  onClick,
}: {
  icon: string;
  text: string;
  isSelected: boolean;
  onClick: () => void;
}): JSX.Element => (
  <Styled.MissionButton onClick={onClick}>
    <Styled.MissionButtonIcon>{icon}</Styled.MissionButtonIcon>
    <Styled.MissionButtonText isSelected={isSelected}>{text}</Styled.MissionButtonText>
  </Styled.MissionButton>
);
