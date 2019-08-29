/* eslint-disable */

const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  // Use environment variables to determine mode
  mode: 'development',
  entry: './src/client/index.tsx',
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
      // {
      //   test: /\.js$/,
      //   use: ['source-map-loader'],
      //   enforce: 'pre',
      // },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js', '.tsx', '.jsx', '.json']
  },
  plugins: [
    new CleanWebpackPlugin (),
    new HTMLWebpackPlugin ({
      template: 'src/client/index.html',
      filename: 'index.html'
    }),
  ],
};
