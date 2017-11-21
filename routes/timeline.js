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

router.get('/', (req, res, next) => {
  const user = req.user;

  User
    .findOne({ username: user.username }, '_id username')
    .exec((err, user) => {
      if (!user) { return; }

      Post.find({ 'user_name': user.username })
        .sort({ created_at: -1 })
        .exec((err, posts) => {
          res.render('posts/index',
            {
              username: user.username,
              posts,
              moment,

              name: user.name,
              title: posts.title,
              content: posts.content

            });
        });
    });
});
module.exports = router;
