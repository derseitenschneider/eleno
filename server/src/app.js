const express = require('express');
const morgan = require('morgan');
const homeworkRouter = require('./routes/homeworkRouter');
const app = express();

app.use(morgan('dev'));
app.use('/homework', homeworkRouter);

module.exports = app;
