import styled, { createGlobalStyle } from 'styled-components';

const DARK_BLUE = '#1C2C59';

export const Global = createGlobalStyle`
    @import url('https://fonts.googleapis.com/css?family=Turret+Road');

  body {
    background-color: #6E7E85;
    font-family: 'Turret Road';
    background-image: url(/assets/bg.jpg);
    backdrop-filter: blur(10px);
    background-position: right center;
    background-size: auto 100%;
    color: white;
    text-shadow: 2px 2px 8px ${DARK_BLUE}
    margin: 0;
    height: 100vh;
  }

  button {
    width: 100%;
    border-radius: 0;
    padding: 10px;
    margin: 10px 0px;
    border: 0px;
    background: #1C2C59;
    font-size: 20px;
    font-weight: bold;
    color: white;
    font-family: 'Turret Road';
    text-shadow: none;

    :disabled {
      color: grey
    }
  }

  input {
    font-size: 24px;
    font-family: 'Turret Road';
    width: 100%;
    padding: 10px 0px;
    margin: 10px 0px;
    text-align: center;
    text-shadow: none;
    border-color: ${DARK_BLUE};
    color: ${DARK_BLUE};
  }

  p {
    margin: 1vh;
  }

`;

export const AppContainer = styled.div`
  display: flex;
  justify-content: center;
  text-align: center;
  height: 80vh;
  h1 {
    font-family: 'Turret Road';
  }
  input {
    border: 1px solid black;
  }
`;
