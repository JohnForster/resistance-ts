/* eslint-disable */
const path = require('path');
const chalk = require('chalk');
const ip = require('ip');

const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const tsxControlStatements = require('tsx-control-statements').default;
// const CompressionPlugin = require('compression-webpack-plugin');

const isDev = process.env.NODE_ENV !== 'production';
const DEV_API_ADDRESS = `${ip.address()}:${process.env.PORT}`;

console.log(
  'NODE_ENV:'.padStart(19),
  chalk.bold.yellow(JSON.stringify(process.env.NODE_ENV)),
);
if (isDev) {
  console.log('PORT:'.padStart(19), chalk.bold.yellow(process.env.PORT));
  console.log(
    'DEV_API_ADDRESS:'.padStart(19),
    chalk.bold.yellow(DEV_API_ADDRESS),
  );
}

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
          {
            loader: 'ts-loader',
            options: {
              getCustomTransformers: () => ({
                before: [tsxControlStatements()],
              }),
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
    alias: {
      '@shared': path.resolve(__dirname, '../shared'),
    },
  },
  plugins: [
    // Do I also need a CompressionPlugin?
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
    new webpack.DefinePlugin({
      'process.env.DEV_API_ADDRESS': isDev && JSON.stringify(DEV_API_ADDRESS),
    }),
  ].filter(Boolean),
  devServer: {
    port: 8080,
    host: '0.0.0.0',
    useLocalIp: true,
  },
};
