import express, { Response, Request } from 'express';
import path from 'path';

const app = express();
const isDev = process.env.NODE_ENV === 'development';

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
