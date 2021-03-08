import clamp from 'lodash/clamp';
import styled, { createGlobalStyle } from 'styled-components';
import responsive from '../helpers/responsive';

const DARK_BLUE = '#1C2C59';

export const Global = createGlobalStyle`
  body {
    font-family: 'Turret Road';
    text-shadow: 2px 2px 8px ${DARK_BLUE};
    margin: 0;
    /* height: 100%; */
    align-self:center;
    color:white;
    background-color: ${DARK_BLUE}
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
    border: 1px solid black;
    color: ${DARK_BLUE};
  }

  p {
    margin: 0.5rem;
  }
`;

const h1Margins = [17, 21.4, 21.4];
const h2Margins = [14, 19.9, 19.9];
const h3Margins = [11, 18.7, 18.7];
export const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  height: ${0.8 * window.screen.height}px;
  ${responsive`
    h1 {
      margin-top: ${h1Margins}px;
      margin-bottom: ${h1Margins}px;
    }
    h2 {
      margin-top: ${h2Margins}px;
      margin-bottom: ${h2Margins}px;
    }
    h3 {
      margin-top: ${h3Margins}px;
      margin-bottom: ${h3Margins}px;
    }
  `}
`;

const BG_RESOLUTION = { x: 1920, y: 1080 };
const ACTUAL_DUDE_POSITION = { left: 690, top: 720 };
const IDEAL_POSITION = { left: 0.2, top: 0.8 };

const idealPositionOnScreenTopLeft = {
  left: window.screen.width * IDEAL_POSITION.left,
  top: window.screen.height * IDEAL_POSITION.top,
};

const adjustment = {
  top: idealPositionOnScreenTopLeft.top - ACTUAL_DUDE_POSITION.top,
  left: idealPositionOnScreenTopLeft.left - ACTUAL_DUDE_POSITION.left,
};

const maximums = {
  top: Math.max(0, BG_RESOLUTION.y - window.screen.height),
  left: Math.max(0, BG_RESOLUTION.x - window.screen.width),
};

const scaleX = window.screen.width / BG_RESOLUTION.x;
const scaleY = window.screen.height / BG_RESOLUTION.y;
const scale = Math.max(1, scaleX, scaleY);

const translateX = clamp(adjustment.left, -maximums.left, 0);
const translateY = clamp(adjustment.top, -maximums.top, 0);

console.log('translateX, translateY:', translateX, translateY);

export const BackgroundImage = styled.img`
  position: fixed;
  overflow: hidden;
  transform-origin: top left;
  transform: scale(${scale})
    translate(${translateX * scale}px, ${translateY * scale}px);
  z-index: -1;
  filter: blur(3px) brightness(0.9);
`;
