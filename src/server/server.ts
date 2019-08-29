import express, { Response, Request } from 'express';
import path from 'path';

const app = express();

const isDev = process.env.NODE_ENV === 'development';
const middlePath = isDev ? '../../build' : '';
app.use(express.static(path.join(__dirname, middlePath, '/dist')));

app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, middlePath, '/dist/index.html'));
});

const port = isDev ? 8080 : 8081;
app.listen(port);
