import path from 'path';
import http from 'http';

import express, { RequestHandler } from 'express';
import expressStaticGzip from 'express-static-gzip';
import { Server as SocketsIOServer } from 'socket.io';
import chalk from 'chalk';

import { ioConnectionListener } from './middleware/ioEventListener';

import getLocalIP from './utils/getLocalIP';

console.log(chalk.blue('-'.repeat(80)));

const isDev = process.env.NODE_ENV === 'development';
const port = parseInt(process.env.PORT || '8080');

const app = express();

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
  upgradeHttpsMiddleware,
  expressStaticGzip(publicPath, {
    enableBrotli: true,
  }),
);

const server = http.createServer(app);
const io = new SocketsIOServer(server, {
  cors: {
    origin: 'http://localhost:8080',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', ioConnectionListener);

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
