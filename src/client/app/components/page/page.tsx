import React from 'react';
import styled from 'styled-components';
import responsive from '../../helpers/responsive';

const Page = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  align-items: center;
  height: 100%;
  width: 80%;
  animation: fade-in 0.5s;
  margin: auto;
  padding-bottom: 2rem;
  box-sizing: border-box;
  ${responsive`
    padding-top: ${[0, 2, 2]}rem;
  `} @media only screen and (min-width: 992px) {
    max-width: 60vh;
  }

  @keyframes fade-in {
    0% {
      opacity: 0%;
    }
    100% {
      opacity: 100%;
    }
  }
`;

export default Page;
