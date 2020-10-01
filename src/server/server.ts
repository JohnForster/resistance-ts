import express, { Response, Request, RequestHandler } from 'express';
import path from 'path';
import createWebSocket from 'express-ws';
import cookieParser from 'cookie-parser';
import expressStaticGzip from 'express-static-gzip';
import chalk from 'chalk';

import getLocalIP from './utils/getLocalIP';
import User from './models/user';
import Game from './models/game/game';
import WSEventHandler from './helpers/wsEventHandler';

console.log(chalk.blue('-'.repeat(80)));

const isDev = process.env.NODE_ENV === 'development';

const { app } = createWebSocket(express());
app.use(cookieParser());

// Could users and games be stored within WSEventHandler?
const users = new Map<string, User>();
const games = new Map<string, Game>();

const wsEventHandler = new WSEventHandler(users, games);

// Websocket routes
app.ws('/ws', wsEventHandler.middleWare);

// Publicly expose the '/dist' folder
const middlePath = isDev ? '../../build' : '';
const publicPath = path.join(__dirname, middlePath, '/dist');

const upgradeHttpsMiddleware: RequestHandler = (req, res, next) => {
  if (!isDev && req.header('x-forwarded-proto') !== 'https') {
    console.log('Request received over http... Redirecting...');
    res.redirect(`https://${req.header('host')}${req.url}`);
  } else {
    next();
  }
};

app.use(
  '/',
  upgradeHttpsMiddleware,
  expressStaticGzip(publicPath, {
    enableBrotli: true,
  }),
);

const port = parseInt(process.env.PORT || '8080');

// Listen on local IP (for connecting over LAN)
if (isDev) {
  getLocalIP().then(address => {
    app.listen(port, '0.0.0.0');
    console.log(`Server available at ${chalk.green(`http://${address}:${port}`)}`);
  });
} else {
  // Will need to work out how this works in prod
  console.log('listening on port:', port);
  app.listen(port);
}
