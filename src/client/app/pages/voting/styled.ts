import styled, { css } from 'styled-components';
/* eslint-disable */

const VoteButton = styled.button`
  font-size: 48px;
  ${(props: {isGreyed: boolean}) => props.isGreyed && css`
      filter: grayscale(100%);
  `}
  margin: 20px;
  width:100px;
  background: none;
`;

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const ThumbContainer = styled.div`
  width: 100%;
  font-size: 72px;
`

export default {
  VoteButton,
  ButtonContainer,
  ThumbContainer,
}
