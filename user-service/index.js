const express = require('express');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

const { config } = require('./config');
const logger = require('./config/logger');

const { corsMiddleware } = require('./middlewares/cors.middleware');
const errorHandler = require('./middlewares/error.middleware');
const { reqLogger } = require('./middlewares/req.middleware');

const app = express();

app.use(helmet());
app.use(corsMiddleware);
app.use(reqLogger);
app.use(cookieParser());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello world from user-service');
});
