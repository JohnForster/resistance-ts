import express, { Response, Request } from 'express';
import path from 'path';
import createWebSocket from 'express-ws';
import uuidv4 from 'uuid/v4';
import getLocalIP from './utils/getLocalIP';

const isDev = process.env.NODE_ENV === 'development';

const { app } = createWebSocket(express());

const users = new Map();

// Websocket routes
app.ws('/echo', (ws, req) => {
  console.log(new Date() + ' Recieved a new connection from origin ' + req.ip);
  const userID = uuidv4();
  users.set(userID, ws);

  ws.on('message', msg => {
    ws.send(msg);
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

// Listen locally
app.listen(port);
console.log(`App available at http://localhost:${port}`);

// Listen on local IP (for connecting over LAN)
if (isDev) {
  getLocalIP().then(address => {
    app.listen(port, address);
    console.log(`App available at http://${address}:${port}`);
  });
}
