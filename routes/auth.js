'use strict';

const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const router = express.Router();

const multer = require('multer');
const upload = multer({ dest: './public/uploads/' });

// const ensureLogin = require("connect-ensure-login");

const User = require('../models/user').User;

const bcryptSalt = 10;

router.use((req, res, next) => {
  if (req.user && req.path !== '/logout') {
    return next();
  } else {
    res.redirect('/');
  }
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
  const photo = {
    pic_path: 'http://facebookcraze.com/wp-content/uploads/2010/10/alternative-facebook-profile-picture-superman-funny-joke.jpg',
    pic_name: 'Default Profile'
  };

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
      email,
      photo
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

// Profile
router.get('/profile/:userID', (req, res, next) => {
  const uID = req.params.userID;
  console.log(uID);
  User.findById(uID, (err, user) => {
    if (err) { return next(err); }
    res.render('auth/profile', { user: user });
  });
});

// Edit Profile
router.get('/profile/:userID/edit', (req, res, next) => {
  const uID = req.params.userID;
  console.log(uID);
  User.findById(uID, (err, user) => {
    if (err) { return next(err); }
    res.render('auth/edit', { usert: user });
  });
});

router.post('/profile/:userID/edit', upload.single('photo'), (req, res, next) => {
  const username = req.body.username;
  const name = req.body.name;
  const email = req.body.email;
  const photo = {
    pic_path: `/uploads/${req.file.filename}`,
    pic_name: req.file.originalname
  };

  const newProfile = {
    username,
    name: name,
    email: email,
    photo
  };

  User.findOneAndUpdate({ _id: req.user._id }, { $set: newProfile }, (err, result) => {
    if (err) {
      return next(err);
    }
    res.redirect('/timeline');
  });
});

module.exports = router;
