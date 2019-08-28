/* eslint-disable */

const path = require('path')

module.exports = {
  // Use environment variables to determine mode
  mode: 'development',
  entry: './src/client/index.ts',
  output: {
    path: path.resolve(__dirname, 'build/dist'),
    // publicPath: 'https://playTheResistance.io/public'
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'babel-loader',
      },
      {
        test: /\.js$/,
        use: ['source-map-loader'],
        enforce: 'pre',
      },
    ],
  },
};
