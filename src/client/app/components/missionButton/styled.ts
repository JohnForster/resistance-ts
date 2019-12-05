import styled from 'styled-components';

export const MissionButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const MissionButton = styled.button`
  width: 150px;
  background-color: Transparent;
`;

export const MissionButtonIcon = styled.p`
  filter: brightness(0.9);
  font-size: 72px;
`;

export const MissionButtonText = styled.p`
  ${(props: { isSelected: boolean }): string =>
    props.isSelected &&
    `
    text-decoration: underline;
    text-underline-offset: 10px;
  `}
`;
