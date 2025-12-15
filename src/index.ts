import express from 'express';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../.env') });
import cors from 'cors';
import { StatusCodes } from 'http-status-codes';
import loggerMiddleware from './middleware/logger.middleware';
import logger from './util/logger/logger';
import config from './configs/common.config';

global.basedir = __dirname;
global.APP_NAME = config.APP_NAME;
global.APP_URL = config.APP_URL;

// create and setup express app
const app = express();

const allowedOrigins = [global.APP_URL, config.CLIENT_URL];
const corsOptions: cors.CorsOptions = {
  origin: allowedOrigins,
};
app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Connect to MongoDB
import connectMongo from './models/db';
connectMongo();

// Middleware to log each request and response
app.use(loggerMiddleware);

app.use('/public', express.static(`${global.basedir}/public`));

// Rate Limiter
// import limiter from './util/rateLimiter';
// app.use(limiter);

// Global  version check
import routeMiddlewares from './middleware/routeMiddleware';
app.use(routeMiddlewares.checkVersion);

const health = async (request: Request, response: Response) => {
  response.status(StatusCodes.OK).json({
    message: 'Uniq Leagues server is working',
    env: config.NODE_ENV,
    headers: request.headers,
  });
};

app.get('/', health);

// Main router
import { mainRouter } from './routes';
app.use('/api', mainRouter);

app.use((_request: Request, response: Response) => {
  return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    message: 'No route found',
  });
});

// Error handling middleware
app.use(
  (
    error: Error,
    _request: Request,
    response: Response,
    _next: NextFunction
  ) => {
    logger.error(`Error occurred: ${error.message}`);
    return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Internal Server Error',
      error: error.message,
    });
  }
);

const port = config.PORT;
app.listen(port, () => {
  console.log(
    `========== Server is running on port ${port}, ${config.NODE_ENV}, ${
      config.DEVELOPER_NAME
    } ==========`
  );
});
