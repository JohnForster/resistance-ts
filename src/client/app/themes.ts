export interface Theme {
  name: string;
  background: Background;
  colours: {
    button: string;
    shadow: string;
  };
  fontFamily: string;
  brightness: string;
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
  darkGreen: '#283224',
  lightBlue: '#6F99B4',
};

const avalon: Theme = {
  name: 'avalon',
  colours: {
    button: colours.lightBlue,
    shadow: colours.darkGreen,
  },
  background: CASTLE,
  fontFamily: 'Fondamento',
  brightness: '1',
};

const resistance: Theme = {
  name: 'resistance',
  colours: {
    button: colours.darkBlue,
    shadow: colours.darkBlue,
  },
  background: SKYLINE,
  fontFamily: 'Turret Road',
  brightness: '0.9',
};

export const themes: Record<ThemeName, Theme> = {
  avalon,
  resistance,
};
