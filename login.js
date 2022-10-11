'use strict';

const express = require('express');
const router = express.Router();
const vouch = require('./vouch');

// middleware
router.use(express.urlencoded({ extended: false }));

router.get('/', function (req, res) {
  res.render('login');
});

router.post('/', async function (req, res, next) {
  vouch.authenticateUser(req.body.username, req.body.password, (err, token) => {
    if (err) return next(err);
    if (token) {
      console.log(token);
      res.redirect('back');
    } else {
      res.redirect('/login');
    }
  });
});

module.exports = router;
