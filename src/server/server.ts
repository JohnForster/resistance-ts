import express, { Response, Request } from 'express';
import path from 'path';

const app = express();

const isDev = true;
const middlePath = isDev ? '../../build' : '';
app.use(express.static(path.join(__dirname, middlePath, '/dist')));

app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, middlePath, '/dist/index.html'));
});

app.listen(8080);
