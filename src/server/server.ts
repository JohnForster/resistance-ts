import express, { Response, Request } from 'express';
import path from 'path';
import createWebSocket from 'express-ws';
import uuidv4 from 'uuid/v4';

import getLocalIP from './utils/getLocalIP';
import { WSEvent, MessageEvent } from '../shared/types/eventTypes';
import User from './models/user';
import Game from './models/game';

const isDev = process.env.NODE_ENV === 'development';

const { app } = createWebSocket(express());

const users = new Map();
const games = new Map();

// Websocket routes
app.ws('/echo', (ws, req) => {
  const user = new User(ws, req.ip);
  console.log(new Date() + ' Recieved a new connection from origin ' + req.ip);
  users.set(user.id, user);

  ws.on('message', msg => {
    const [event, data] = JSON.parse(msg as string);
    console.log(new Date(), 'Message recieved:', [event, data]);

    if (event === 'create_game') {
      if (games.get(user.id)) return ws.send(JSON.stringify({ event: 'error', data: 'game already exists' }));
      const game = new Game(user);
      games.set(user.id, game);

      ws.send(JSON.stringify({ event: 'game_created', data: game.id }));
    }
    if (event === 'message') {
      const payload: MessageEvent = { event: 'message', data: 'the fuck is up coachella?!' };
      ws.send(JSON.stringify(payload));
    }
  });
});

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
