'use strict';

const express = require('express');
const router = express.Router();

const multer = require('multer');
const upload = multer({ dest: './public/uploads/' });

const User = require('../models/user').User;

router.use((req, res, next) => {
  if (!req.user) {
    res.redirect('/');
  } else {
    next();
  }
});

// Profile
router.get('/:userID', (req, res, next) => {
  const uID = req.params.userID;
  console.log(uID);
  User.findById(uID, (err, user) => {
    if (err) { return next(err); }
    res.render('auth/profile', { user: user });
  });
});

// Edit Profile
router.get('/:userID/edit', (req, res, next) => {
  const uID = req.params.userID;
  console.log(uID);
  User.findById(uID, (err, user) => {
    if (err) { return next(err); }
    res.render('auth/edit', { usert: user });
  });
});

router.post('/:userID/edit', upload.single('photo'), (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const newProfile = {
    name: name,
    email: email
  };

  if (req.file) {
    newProfile.photo = {
      pic_path: `/uploads/${req.file.filename}`,
      pic_name: req.file.originalname
    };
  }

  User.findOneAndUpdate({ _id: req.user._id }, { $set: newProfile }, (err, result) => {
    if (err) {
      return next(err);
    }
    res.redirect('/timeline');
  });
});

module.exports = router;
