'use strict';

const express = require('express');
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
      if (!user) { return; } else {
        if (err) {
          return next(err);
        };
      }
      res.render('posts/explore',

        {
          name: user.name,

          posts,
          moment,
          username: posts.user_name

        });
    });
});

// function getMapMarkerFromPost (post) {

// }

router.get('/map', (req, res, next) => {
  const user = req.user;
  Post.find({ 'postStatus': { $regex: '.*public.*' } })
    .exec((err, posts) => {
      if (!user) { return; } else {
        if (err) {
          return next(err);
        };
      }
      var data = {
        name: user.name,
        userHash: null,
        posts: posts,
        moment: moment,
        post_status: 'publicPost'
      };

      var userIds = [];
      posts.forEach((post) => {
        userIds.push(post.user_id.toString());
      });

      User.find(/* { user_id: { $in: userIds } } */)
        .exec((err, users) => {
          const userHash = {};

          users.forEach((user) => {
            userHash[user._id] = user;
          });

          data.userHash = userHash;

          // var test = data.posts.location;
          res.render('maps/all', data);
        });
    });
});
module.exports = router;
