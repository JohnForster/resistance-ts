import styled from 'styled-components';

export const MissionButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const MissionButton = styled.button`
  width: 150px;
  background-color: Transparent;
  :focus {
    outline: none;
    box-shadow: none;
  }

  @media only screen and (max-width: 350px) {
    margin: 2px;
    padding: 2px;
  }
`;

export const MissionButtonIcon = styled.p`
  filter: brightness(0.9);
  font-size: 60px;
`;

export const MissionButtonText = styled.p`
  ${(props: { isSelected: boolean }): string =>
    props.isSelected &&
    `
    text-decoration: underline;
    text-underline-offset: 2px;
  `}
`;
