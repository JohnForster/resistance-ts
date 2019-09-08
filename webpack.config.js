/* eslint-disable */

const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: process.env.NODE_ENV,
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
        use: {
          loader: 'babel-loader',
          options: {
            presets: ["@babel/react"]
          }
        }
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
    new CopyWebpackPlugin([{
      from: 'src/client/assets',
      to: 'assets'
    }], { copyUnmodified: true })
  ],
};
