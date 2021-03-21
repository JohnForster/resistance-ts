import responsive from '../../helpers/responsive';
import styled from 'styled-components';

export const Button = styled.button`
  width: auto;
  min-width: 47%;
  display: flex;
  justify-content: center;
  align-items: center;
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
