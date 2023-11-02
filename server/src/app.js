const path = require('path');
const express = require('express');
const morgan = require('morgan');
const homeworkRouter = require('./routes/homeworkRouter');
const compression = require('compression');
const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, '../public')));
app.use(morgan('dev'));

app.use(compression());

// ROUTES
app.get('/', (req, res) => {
  res.status(200).render('base');
});
app.use('/homework', homeworkRouter);

module.exports = app;
