import clamp from 'lodash/clamp';
import styled, { createGlobalStyle, css } from 'styled-components';
import responsive from '../helpers/responsive';

const DARK_BLUE = '#1C2C59';

export const Global = createGlobalStyle`
  body {
    font-family: 'Turret Road';
    text-shadow: 2px 2px 8px ${DARK_BLUE};
    margin: 0;
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
    font-weight: bold;
    color: white;
    font-family: 'Turret Road';
    text-shadow: none;

    ${responsive`
      font-size: ${[18, 20, 22]}px;
    `};

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
export const AppContainer = styled.div<{ screen: Screen }>`
  display: flex;
  flex-direction: column;
  height: ${({ screen }) => screen.height * 0.85}px;
  width: ${({ screen }) => screen.width}px;

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
  `};
`;

const BG_RESOLUTION = { x: 1920, y: 1080 };
const ACTUAL_DUDE_POSITION = { left: 690, top: 720 };
const IDEAL_POSITION = { left: 0.2, top: 0.8 };

const getTransform = (screen: { width: number; height: number }) => {
  const idealPositionOnScreen = {
    left: screen.width * IDEAL_POSITION.left,
    top: screen.height * IDEAL_POSITION.top,
  };

  const adjustment = {
    top: idealPositionOnScreen.top - ACTUAL_DUDE_POSITION.top,
    left: idealPositionOnScreen.left - ACTUAL_DUDE_POSITION.left,
  };

  const maximums = {
    top: Math.max(0, BG_RESOLUTION.y - screen.height),
    left: Math.max(0, BG_RESOLUTION.x - screen.width),
  };

  const scaleX = screen.width / BG_RESOLUTION.x;
  const scaleY = screen.height / BG_RESOLUTION.y;

  const scale = Math.max(1, scaleX, scaleY);

  const translateX = clamp(adjustment.left, -maximums.left, 0);
  const translateY = clamp(adjustment.top, -maximums.top, 0);

  return css`
    transform: scale(${scale})
      translate(${translateX * scale}px, ${translateY * scale}px);
  `;
};

export const BackgroundImage = styled.img<{
  screen: { width: number; height: number };
}>`
  position: fixed;
  overflow: hidden;
  transform-origin: top left;
  ${({ screen }) => getTransform(screen)}
  z-index: -1;
  filter: blur(3px) brightness(0.9);
`;
