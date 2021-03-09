import express, { Response, Request, RequestHandler } from 'express';
import path from 'path';
import http from 'http';
import createWebSocket from 'express-ws';
import expressStaticGzip from 'express-static-gzip';
import chalk from 'chalk';
import { Server as SocketsIOServer } from 'socket.io';
import { IOEventHandler } from './helpers/ioEventHandler';

import getLocalIP from './utils/getLocalIP';
import User from './models/user';
import { Game } from './models/newGame/newGame';
import { Socket } from 'socket.io';

console.log(chalk.blue('-'.repeat(80)));

const isDev = process.env.NODE_ENV === 'development';

const { app } = createWebSocket(express());

// Could users and games be stored within WSEventHandler?
const users = new Map<string, User>();
const games = new Map<string, Game>();

const ioEventHandler = new IOEventHandler(users, games);

const upgradeHttpsMiddleware: RequestHandler = (req, res, next) => {
  if (!isDev && req.header('x-forwarded-proto') !== 'https') {
    console.log('Request received over http... Redirecting...');
    res.redirect(`https://${req.header('host')}${req.url}`);
  } else {
    next();
  }
};

const publicPath = path.join(__dirname, 'dist');
app.use(
  '/',
  // upgradeHttpsMiddleware,
  expressStaticGzip(publicPath, {
    enableBrotli: true,
  }),
);

const port = parseInt(process.env.PORT || '8080');

const server = http.createServer(app);
const io = new SocketsIOServer(server, {
  cors: {
    origin: 'http://localhost:8080',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', ioEventHandler.listener);

// Listen on local IP (for connecting over LAN)
if (isDev) {
  getLocalIP().then((address) => {
    server.listen(port, '0.0.0.0');
    console.log(
      `Server available at ${chalk.green(`http://${address}:${port}`)}`,
    );
  });
} else {
  server.listen(port);
}
