/* eslint-disable */
const path = require('path');
const chalk = require('chalk');
const ip = require('ip');
const webpack = require('webpack');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const isDev = process.env.NODE_ENV !== 'production';
const DEV_API_ADDRESS = `${ip.address()}:${process.env.PORT}`;

const logYellow = (label, value) =>
  console.log(label.padStart(19), chalk.bold.yellow(value));

logYellow('NODE_ENV:', process.env.NODE_ENV);
if (isDev) {
  logYellow('PORT:', process.env.PORT);
  logYellow('DEV_API_ADDRESS:', DEV_API_ADDRESS);
}

const devPlugins = [
  new ReactRefreshPlugin(),
  new webpack.DefinePlugin({
    'process.env.DEV_API_ADDRESS': JSON.stringify(DEV_API_ADDRESS),
  }),
  new webpack.HotModuleReplacementPlugin(),
];

const prodPlugins = [
  // Do I also need a CompressionPlugin?
  new ForkTsCheckerWebpackPlugin(),
  new HTMLWebpackPlugin({
    template: 'index.html',
    filename: 'index.html',
  }),
  new CopyWebpackPlugin({
    patterns: [
      { from: 'assets', to: 'assets' },
      { from: 'manifest.json', to: 'manifest.json' },
      { from: 'pwabuilder-sw.js', to: 'pwabuilder-sw.js' },
      { from: 'offline.html', to: 'offline.html' },
    ],
  }),
];

module.exports = {
  mode: isDev ? 'development' : 'production',
  entry: './index.tsx',
  output: {
    path: path.resolve(__dirname, '../server/build/dist'),
    filename: 'bundle.js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          isDev && {
            loader: 'babel-loader',
            options: { plugins: ['react-refresh/babel'] },
          },
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ].filter(Boolean),
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
    alias: {
      '@shared': path.resolve(__dirname, '../shared'),
    },
  },
  plugins: [...prodPlugins, ...(isDev ? devPlugins : [])],
  devServer: {
    port: 8080,
    host: '0.0.0.0',
    hot: true,
    useLocalIp: true,
    open: true,
  },
};
