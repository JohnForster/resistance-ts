import styled from 'styled-components';
/* eslint-disable */

export const VoteButton = styled.button`
  font-size: 48px;
  ${({isGreyed}: {isGreyed: boolean}) => isGreyed && `
      filter: grayscale(100%);
  `}
  margin: 20px;
  width:100px;
  background: none;
`;

export const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

export const ThumbContainer = styled.div`
  width: 100%;
  font-size: 72px;
`
