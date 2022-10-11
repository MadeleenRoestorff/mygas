'use strict';

/**
 * Module dependencies.
 */

const express = require('express');
const path = require('path');
const vouch = require('./vouch');
const app = (module.exports = express());

const login = require('./login');
const gasController = require('./controller');

// config

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// middleware

app.use('/login', login);
app.use('/controller', vouch.restrict, gasController);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/logout', (req, res) => {
  req.user = null;
  res.redirect('/');
});

/* istanbul ignore next */
if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}
