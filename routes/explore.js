'use strict';

const express = require('express');
const passport = require('passport');
const router = express.Router();

const moment = require('moment');

// const ensureLogin = require("connect-ensure-login");

const User = require('../models/user').User;
const Post = require('../models/post').Post;

router.get('/', (req, res, next) => {
  const user = req.user;

  Post.find({ 'postStatus': { $regex: '.*public.*' } })
    .sort({ created_at: -1 })
    .exec((err, posts) => {
      res.render('posts/index',
        {
          username: posts.user_name,
          posts,
          moment,
          post_status: 'publicPost',
          name: user.name,
          title: posts.title,
          content: posts.content

        });
    });
});

module.exports = router;
