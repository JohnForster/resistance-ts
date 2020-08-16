module.exports =  {
  parser:  '@typescript-eslint/parser',
  plugins: [
    "jsx-control-statements"
  ],
  env: {
    es6: true,
    browser: true,
    node: true,
  },
  extends:  [
    'plugin:react/recommended',  // Uses the recommended rules from @eslint-plugin-react
		'plugin:@typescript-eslint/recommended',
		'prettier/@typescript-eslint',  // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    'plugin:prettier/recommended',// Uses the recommended rules from @typescript-eslint/eslint-plugin
    'plugin:jsx-control-statements/recommended'
  ],
  parserOptions:  {
    ecmaVersion:  2018,  // Allows for the parsing of modern ECMAScript features
    sourceType:  'module',  // Allows for the use of imports
    ecmaFeatures:  {
      jsx:  true,  // Allows for the parsing of JSX
    },
  },
  rules:  {
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    "@typescript-eslint/no-empty-interface": "off",
    "react/jsx-no-undef": [2, { "allowGlobals": true }],
    "react/prop-types": 0,
    "prettier/prettier": "warn",
  },
  settings:  {
    react:  {
      version:  'detect',  // Tells eslint-plugin-react to automatically detect the version of React to use
    },
  },
  "overrides": [
    {
      "files": ["*.js", "*.jsx"],
      "rules": {
        "@typescript-eslint/...": "off",
      }
    }
  ]
};
