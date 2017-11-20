'use strict';

const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const router = express.Router();

// const ensureLogin = require("connect-ensure-login");

const User = require('../models/user').User;

const bcryptSalt = 10;

router.use((req, res, next) => {
  if (req.user && req.path !== '/logout') {
    res.redirect('/');
  }
  next();
});

router.get('/login', function (req, res, next) {
  const data = {
    message: req.flash('error')
  };
  res.render('auth/login', data);
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/menu',
  failureRedirect: '/auth/signup',
  failureFlash: true,
  passReqToCallback: true
}));

// -- signup

router.get('/signup', (req, res, next) => {
  const data = {
    message: req.flash('error')
  };
  res.render('auth/signup', data);
});

router.post('/signup', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const name = req.body.name;
  const email = req.body.email;

  if (username === '' || password === '') {
    const data = {
      message: 'Please provide username and password'
    };
    res.render('auth/signup', data);
    return;
  }

  User.findOne({ username }, 'username', (err, user) => {
    if (err) {
      next(err);
      return;
    }

    if (user) {
      const data = {
        message: 'The username already exists'
      };
      res.render('auth/signup', data);
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass,
      name,
      email
    });

    newUser.save((err) => {
      if (err) {
        next(err);
        return;
      }

      req.login(newUser, () => {
        res.redirect('/menu');
      });
    });
  });
});

// -- logout

router.post('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/auth/login');
});

module.exports = router;
