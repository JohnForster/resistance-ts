import express, { Response, Request } from 'express';
import path from 'path';
import createWebSocket from 'express-ws';

import getLocalIP from './utils/getLocalIP';
import { MessageEvent, GameCreatedEvent, NewPlayerEvent, JoinEvent, ErrorEvent } from '../shared/types/eventTypes';
import User from './models/user';
import Game from './models/game';

const isDev = process.env.NODE_ENV === 'development';

const { app } = createWebSocket(express());

const users = new Map<string, User>();
const games = new Map<string, Game>();

// Websocket routes
app.ws('/echo', (ws, req) => {
  if (users.has(req.ip)) console.log('User already exists!', 'Should reassign that users ws here');
  const user = new User(ws, req.ip);
  console.log(new Date() + ' Recieved a new connection from origin ' + req.ip);
  users.set(req.ip, user);

  const payload: NewPlayerEvent = { event: 'new_player', data: { player_id: user.id } };
  ws.send(JSON.stringify(payload));

  ws.on('message', msg => {
    const [event, data] = JSON.parse(msg as string);
    console.log(new Date(), 'Message recieved:', [event, data]);

    if (event === 'create_game') {
      if (games.get(user.id)) return ws.send(JSON.stringify({ event: 'error', data: 'game already exists' }));
      const game = new Game(user);
      games.set(game.id, game);
      const payload: GameCreatedEvent = { event: 'game_created', data: { game_id: game.id } };
      ws.send(JSON.stringify(payload));
    }
    if (event === 'message') {
      const payload: MessageEvent = { event: 'message', data: 'the fuck is up coachella?!' };
      ws.send(JSON.stringify(payload));
    }
    if (event === 'join_game') {
      const game = games.get((data as JoinEvent['data']).gameID);
      if (!game) {
        return ws.send(
          JSON.stringify({ event: 'error', data: `Game with id ${data.gameID} not found.` } as ErrorEvent),
        );
      }
      game.addPlayer(user);
      console.log(`Adding player ${user.id} to game ${game.id}`);
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
