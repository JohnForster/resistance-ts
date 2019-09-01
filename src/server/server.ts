import express, { Response, Request } from 'express';
import path from 'path';
import createWebSocket from 'express-ws';

const { app } = createWebSocket(express());

const isDev = process.env.NODE_ENV === 'development';

// Websocket routes
app.ws('/echo', (ws, req) => {
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
app.listen(port);
