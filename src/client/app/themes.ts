export interface Theme {
  name: string;
  background: Background;
  colours: {
    menu: string;
    button: string;
    shadow: string;
    progressBar: string;
  };
  fontFamily: string;
  brightness: string;
  saturation: number;
  fontSizeAdjust: number;
}

export type Background = {
  path: string;
  resolution: {
    x: number;
    y: number;
  };
  pointOfInterest: {
    x: number;
    y: number;
  };
  idealPointLocation: {
    top: number;
    left: number;
  };
};

export type ThemeName = 'avalon' | 'resistance';

const CASTLE: Background = {
  path: 'assets/avalon-bg.jpeg',
  resolution: { x: 1920, y: 1080 },
  pointOfInterest: { x: 639, y: 955 },
  idealPointLocation: { left: 0.25, top: 0.9 },
};

const SKYLINE: Background = {
  path: 'assets/bg.jpg',
  resolution: { x: 1920, y: 1080 },
  pointOfInterest: { x: 690, y: 720 },
  idealPointLocation: { left: 0.2, top: 0.8 },
};

const colours = {
  darkBlue: '#1C2C59',
  midGreen: '#414a20',
  darkGreen: '#283224',
  lightBlue: '#6F99B4',
  lighterBlue: '#a6d6f4',
  white: '#FFF',
};

const avalon: Theme = {
  name: 'avalon',
  colours: {
    menu: colours.darkGreen,
    button: colours.midGreen,
    shadow: colours.darkGreen,
    progressBar: colours.lighterBlue,
  },
  background: CASTLE,
  fontFamily: 'Fondamento',
  brightness: '0.9',
  saturation: 1.2,
  fontSizeAdjust: 0.9,
};

const resistance: Theme = {
  name: 'resistance',
  colours: {
    menu: colours.white,
    button: colours.darkBlue,
    shadow: colours.darkBlue,
    progressBar: colours.white,
  },
  background: SKYLINE,
  fontFamily: 'Turret Road',
  brightness: '0.9',
  saturation: 1,
  fontSizeAdjust: 0,
};

export const themes: Record<ThemeName, Theme> = {
  avalon,
  resistance,
};
