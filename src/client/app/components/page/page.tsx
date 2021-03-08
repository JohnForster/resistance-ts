import React from 'react';
import styled from 'styled-components';
import responsive from '../../helpers/responsive';

const Page = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  width: 80%;
  animation: fade-in 0.5s;
  margin: auto;

  ${responsive`
    padding-top: ${[0, 5, 5]}%;
  `}

  @media only screen and (min-width: 992px) {
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
