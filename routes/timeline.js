'use strict';

const express = require('express');
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

  User.findOne({ username: user.username }, '_id username')
    .exec((err, user) => {
      if (!user) { return; } else {
        if (err) {
          return next(err);
        };
      }

      Post.find({ 'user_name': user.username })
        .sort({ created_at: -1 })
        .exec((err, posts) => {
          if (!user) { return; } else {
            if (err) {
              return next(err);
            };
          }
          res.render('posts/timeline',
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

// MAP
router.get('/map', function (req, res, next) {
  res.render('maps/global', { user: req.user });
});

module.exports = router;
