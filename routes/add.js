'use strict';

const express = require('express');
const passport = require('passport');
const router = express.Router();

const moment = require('moment');

// const ensureLogin = require("connect-ensure-login");

const User = require('../models/user').User;
const Post = require('../models/post').Post;

router.use((req, res, next) => {
  if (req.user && req.path !== '/logout') {
    return next();
  } else {
    res.redirect('/');
  }
});

router.get('/', function (req, res, next) {
  res.render('posts/add', { title: 'El-Diario' });
});

router.get('/new', function (req, res, next) {
  res.render('posts/newpost', { user: req.user });
});

router.post('/new', (req, res, next) => {
  const user = req.user;
  User.findOne({ username: user.username }).exec((err, user) => {
    if (err) { return; }
    const postInfo = {
      title: req.body.postTitle,
      content: req.body.postContent,
      user_id: user._id,
      user_name: user.username
    };

    const newPost = new Post(postInfo);

    newPost.save((err) => {
      if (err) {
        return next(err);
      }
      res.redirect('/timeline');
    });
  });
});

module.exports = router;
