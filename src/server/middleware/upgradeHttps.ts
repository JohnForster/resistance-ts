import { RequestHandler } from 'express';

const isDev = process.env.NODE_ENV === 'development';

export const upgradeHttps: RequestHandler = (req, res, next) => {
  if (!isDev && req.header('x-forwarded-proto') !== 'https') {
    console.log('Request received over http... Redirecting...');
    res.redirect(`https://${req.header('host')}${req.url}`);
  } else {
    next();
  }
};
