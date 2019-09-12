import express, { Response, Request } from 'express';
import path from 'path';
import createWebSocket from 'express-ws';

import getLocalIP from './utils/getLocalIP';
import User from './models/user';
import Game from './models/game';
import WSEventHandler from './helpers/wsEventHandler';

const isDev = process.env.NODE_ENV === 'development';

const { app } = createWebSocket(express());

// Could users and games be stored within WSEventHandler?
const users = new Map<string, User>();
const games = new Map<string, Game>();

const wsEventHandler = new WSEventHandler(users, games);

// Websocket routes
app.ws('/echo', wsEventHandler.middleWare);

// Publicly expose the '/dist' folder
const middlePath = isDev ? '../../build' : '';
const publicPath = path.join(__dirname, middlePath, '/dist');
app.use(express.static(publicPath));

// Send index.html when visiting '/'
app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, middlePath, '/dist/index.html'));
});

const port = isDev ? 8080 : 8081;

// Listen on local IP (for connecting over LAN)
if (isDev) {
  getLocalIP().then(address => {
    app.listen(port, '0.0.0.0');
    console.log(`App available at http://${address}:${port}`);
  });
} else {
  // Will need to work out how this works in prod
  app.listen(port);
}
