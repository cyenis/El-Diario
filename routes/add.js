'use strict';

const express = require('express');
const passport = require('passport');
const router = express.Router();

const moment = require('moment');
const multer = require('multer');
const upload = multer({ dest: './public/uploads/' });

// const ensureLogin = require("connect-ensure-login");

const User = require('../models/user').User;
const Post = require('../models/post').Post;

// Protect private links

router.use((req, res, next) => {
  if (req.user && req.path !== '/logout') {
    return next();
  } else {
    res.redirect('/');
  }
});

// Redirect to ADD
router.get('/', function (req, res, next) {
  res.render('posts/add', { title: 'El-Diario' });
});

// Redirect to add new post form
router.get('/new', function (req, res, next) {
  res.render('posts/newpost', { user: req.user });
});

/* ADD ONE post */

router.post('/new', upload.single('photo'), (req, res, next) => {
  const user = req.user;

  const pic = {
    pic_path: `/uploads/${req.file.filename}`,
    pic_name: req.file.originalname
  };

  const loc = {
    latitude: req.body.latitude,
    longitude: req.body.longitude
  };

  User.findOne({ username: user.username }).exec((err, user) => {
    if (err) { return; }

    const postInfo = {
      title: req.body.postTitle,
      content: req.body.postContent,
      picture: pic,
      location: loc,
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

// router
//   .post('/new', upload.single('photo'), function (req, res) {
//     const pic = new Picture({
//       pic_path: `/uploads/${req.file.filename}`,
//       pic_name: req.file.originalname
//     });

//     pic.save((err) => {
//       res.redirect('/timeline');
//     });
//   });

/* SHOW ONE post */
router.get('/new/:postID', (req, res, next) => {
  const pID = req.params.postID;
  console.log(pID);
  Post.findById(pID, (err, post) => {
    if (err) { return next(err); }
    res.render('posts/show', { post: post });
  });
});

/* EDIT ONE post */
router.get('/new/:postID/edit', (req, res, next) => {
  const pID = req.params.postID;
  console.log(pID);
  Post.findById(pID, (err, post) => {
    if (err) { return next(err); }
    res.render('posts/edit', { post: post });
  });
});

router.post('/new/:postID', (req, res, next) => {
  const pId = req.params.postID;
  const user = req.user;

  /*
   * Create a new object with all of the information from the request body.
   * This correlates directly with the schema of Product
   */
  const updates = {
    title: req.body.postTitle,
    content: req.body.postContent,
    user_id: user._id,
    user_name: user.username
  };

  Post.findByIdAndUpdate(pId, updates, (err, post) => {
    if (err) { return next(err); }
    return res.redirect('/timeline');
  });
});

/* DELETE ONE post */

router.post('/new/:postID/delete', (req, res, next) => {
  const pID = req.params.postID;
  const user = req.user;

  Post.findByIdAndRemove(pID, (err, post) => {
    if (err) { return next(err); }
    return res.redirect('/timeline');
  });
});

module.exports = router;
