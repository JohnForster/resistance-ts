import styled, { createGlobalStyle } from 'styled-components';

export const Global = createGlobalStyle`
    @import url('https://fonts.googleapis.com/css?family=Turret+Road');

  body {
    background-color: #6E7E85;
    font-family: 'Turret Road';
  }

  button {
    width: 100%;
    border-radius: 0;
    padding: 10px;
    margin: 10px 0px;
    border: 0px;
    background: #7D98A1;
    font-size: 20px;
    font-weight: bold;
    color: white;
    font-family: 'Turret Road';

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
