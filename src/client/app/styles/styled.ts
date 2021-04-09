import clamp from 'lodash/clamp';
import styled, { createGlobalStyle, css } from './themed-styled-components';
import responsive from '../helpers/responsive';
import { Background } from '../themes';
export const Global = createGlobalStyle`


  body, html, #root {
    height: 100%;
    width: 100%;
    transition-timing-function: linear;
  }

  body {
    font-family: '${({ theme }) => theme.fontFamily}';
    text-shadow:
      2px 2px 4px ${({ theme }) => theme.colours.shadow},
      0px 0px 2px ${({ theme }) => theme.colours.shadow};
    margin: 0;
    align-self: center;
    color: white;
    background-color: ${({ theme }) => theme.colours.button};
  }

  button, input[type="text"] {
  ${responsive`margin: ${[5, 10, 10]}px 0px;`}
    font-family: '${({ theme }) => theme.fontFamily}';
    text-shadow: none;
    width: 100%;

    ${responsive`
      font-size: ${[16, 20, 22]}px;
      max-width: ${[100, 80, 50]}%;
    `};
  }

  button {
    border-radius: 0;
    padding: 10px;
    border: 0px;
    background: ${({ theme }) => theme.colours.button};
    font-weight: bold;
    color: white;
    line-height: 18px;


    :disabled {
      color: grey
    }
  }

  input[type="text"] {
    padding: 10px 0px;
    text-align: center;
    text-shadow: none;
    border: 1px solid ${({ theme }) => theme.colours.button};
    color: ${({ theme }) => theme.colours.button};
  }

  p {
    margin: 0.5rem;
  }
`;

const h1Margins = [14, 21.4, 21.4];
const h2Margins = [12, 19.9, 19.9];
const h3Margins = [9, 18.7, 18.7];
export const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 85%;
  width: 100%;

  ${responsive`
    h1 {
      line-height: 32px;

      margin-top: ${h1Margins}px;
      margin-bottom: ${h1Margins}px;
    }
    h2 {
      line-height: 32px;
      margin-top: ${h2Margins}px;
      margin-bottom: ${h2Margins}px;
    }
    h3 {
      line-height: 32px;
      margin-top: ${h3Margins}px;
      margin-bottom: ${h3Margins}px;
    }
  `};
`;

const getTransform = (
  screen: { width: number; height: number },
  image: Background,
) => {
  const scaleX = screen.width / image.resolution.x;
  const scaleY = screen.height / image.resolution.y;
  const scale = Math.max(scaleX, scaleY);

  const imageSize = {
    x: scale * image.resolution.x,
    y: scale * image.resolution.y,
  };

  const scaledPositionOfInterest = {
    left: scale * image.pointOfInterest.x,
    top: scale * image.pointOfInterest.y,
  };

  const idealPositionOnScreen = {
    left: screen.width * image.idealPointLocation.left,
    top: screen.height * image.idealPointLocation.top,
  };

  const exactAdjustment = {
    left: idealPositionOnScreen.left - scaledPositionOfInterest.left,
    top: idealPositionOnScreen.top - scaledPositionOfInterest.top,
  };

  // How far the image can be moved in each direction while still
  // being on screen.
  const adjustmentLimits = {
    left: screen.width - imageSize.x,
    top: screen.height - imageSize.y,
  };

  const translate = {
    x: clamp(exactAdjustment.left, adjustmentLimits.left, 0),
    y: clamp(exactAdjustment.top, adjustmentLimits.top, 0),
  };

  return css`
    transform: scale(${scale})
      translate(${translate.x / scale}px, ${translate.y / scale}px);
  `;
};

type ScreenSize = { width: number; height: number };
export const BackgroundImage = styled.img<{
  screenSize: ScreenSize;
}>`
  position: fixed;
  overflow: hidden;
  transform-origin: top left;
  ${({ screenSize, theme }) => getTransform(screenSize, theme.background)}
  z-index: -1;
  filter: blur(3px) brightness(${({ theme }) => theme.brightness})
    saturate(${({ theme }) => theme.saturation});
`;

export const LoadingContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
`;
