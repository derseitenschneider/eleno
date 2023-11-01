const express = require('express');
const morgan = require('morgan');
const homeworkRouter = require('./routes/homeworkRouter');
const compression = require('compression');
const app = express();

app.use(morgan('dev'));

app.use(compression());
app.use('/homework', homeworkRouter);

module.exports = app;
