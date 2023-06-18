const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const router = require('./routes');
const errorHandler = require('./utils/errorHandler');
require('dotenv').config();

const app = express();

// Middlewares
app.use(express.json());
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
app.use(cors());

app.use('/api/v1', router);
app.get('/', (req, res) => {
  return res.send('Welcome to express!');
});

// middlewares después de las rutas
app.use(errorHandler);

module.exports = app;
