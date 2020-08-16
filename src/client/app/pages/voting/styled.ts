import styled from 'styled-components';
import responsive from '@client/app/helpers/responsive';
/* eslint-disable */

export const VoteButton = styled.button`
  font-size: 48px;
  ${({isGreyed}: {isGreyed: boolean}) => isGreyed && `
      filter: grayscale(100%);
  `}
  ${responsive`
    margin: ${[0, 20, 20]}px
  `}
  width:100px;
  background: none;
  :focus {
    outline: none;
    box-shadow: none;
  }
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
