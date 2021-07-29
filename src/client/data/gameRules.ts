// TODO MOVE TO SHARED. IS THIS EVEN STILL IN USE?

export type Rules = {
  numberOfSpies: number;
  numberOfResistance: number;
  missions: {
    [missionNumber: number]: {
      players: number;
      failsRequired: number;
    };
  };
};

const devRules: { [playres: number]: Rules } = {
  2: {
    numberOfSpies: 1,
    numberOfResistance: 1,
    missions: {
      1: {
        players: 2,
        failsRequired: 1,
      },
      2: {
        players: 2,
        failsRequired: 1,
      },
      3: {
        players: 2,
        failsRequired: 1,
      },
      4: {
        players: 2,
        failsRequired: 1,
      },
      5: {
        players: 2,
        failsRequired: 1,
      },
    },
  },
  3: {
    numberOfSpies: 1,
    numberOfResistance: 2,
    missions: {
      1: {
        players: 2,
        failsRequired: 1,
      },
      2: {
        players: 3,
        failsRequired: 1,
      },
      3: {
        players: 2,
        failsRequired: 1,
      },
      4: {
        players: 3,
        failsRequired: 1,
      },
      5: {
        players: 3,
        failsRequired: 1,
      },
    },
  },
  4: {
    numberOfSpies: 2,
    numberOfResistance: 2,
    missions: {
      1: {
        players: 2,
        failsRequired: 1,
      },
      2: {
        players: 3,
        failsRequired: 1,
      },
      3: {
        players: 2,
        failsRequired: 1,
      },
      4: {
        players: 3,
        failsRequired: 1,
      },
      5: {
        players: 3,
        failsRequired: 1,
      },
    },
  },
};

const prodRules: { [players: number]: Rules } = {
  5: {
    numberOfSpies: 2,
    numberOfResistance: 3,
    missions: {
      1: {
        players: 2,
        failsRequired: 1,
      },
      2: {
        players: 3,
        failsRequired: 1,
      },
      3: {
        players: 2,
        failsRequired: 1,
      },
      4: {
        players: 3,
        failsRequired: 1,
      },
      5: {
        players: 3,
        failsRequired: 1,
      },
    },
  },
  6: {
    numberOfSpies: 2,
    numberOfResistance: 4,
    missions: {
      1: {
        players: 2,
        failsRequired: 1,
      },
      2: {
        players: 3,
        failsRequired: 1,
      },
      3: {
        players: 4,
        failsRequired: 1,
      },
      4: {
        players: 3,
        failsRequired: 1,
      },
      5: {
        players: 4,
        failsRequired: 1,
      },
    },
  },
  7: {
    numberOfSpies: 3,
    numberOfResistance: 4,
    missions: {
      1: {
        players: 2,
        failsRequired: 1,
      },
      2: {
        players: 3,
        failsRequired: 1,
      },
      3: {
        players: 3,
        failsRequired: 1,
      },
      4: {
        players: 4,
        failsRequired: 2,
      },
      5: {
        players: 4,
        failsRequired: 1,
      },
    },
  },
  8: {
    numberOfSpies: 3,
    numberOfResistance: 5,
    missions: {
      1: {
        players: 3,
        failsRequired: 1,
      },
      2: {
        players: 4,
        failsRequired: 1,
      },
      3: {
        players: 4,
        failsRequired: 1,
      },
      4: {
        players: 5,
        failsRequired: 2,
      },
      5: {
        players: 5,
        failsRequired: 1,
      },
    },
  },
  9: {
    numberOfSpies: 3,
    numberOfResistance: 6,
    missions: {
      1: {
        players: 3,
        failsRequired: 1,
      },
      2: {
        players: 4,
        failsRequired: 1,
      },
      3: {
        players: 4,
        failsRequired: 1,
      },
      4: {
        players: 5,
        failsRequired: 1,
      },
      5: {
        players: 5,
        failsRequired: 1,
      },
    },
  },
  10: {
    numberOfSpies: 4,
    numberOfResistance: 6,
    missions: {
      1: {
        players: 3,
        failsRequired: 1,
      },
      2: {
        players: 4,
        failsRequired: 1,
      },
      3: {
        players: 4,
        failsRequired: 1,
      },
      4: {
        players: 5,
        failsRequired: 2,
      },
      5: {
        players: 5,
        failsRequired: 1,
      },
    },
  },
};
// ! Enable this when a method of preventing games of fewer than 5 people has been implemented
// const isDev = process.env.NODE_ENV === 'development';
// const RULES = { ...prodRules, ...(isDev ? devRules : {}) };
export const RULES = { ...devRules, ...prodRules };
