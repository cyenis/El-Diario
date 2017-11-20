'use strict';

const express = require('express');
const passport = require('passport');
const router = express.Router();

// const ensureLogin = require("connect-ensure-login");

const user = require('../models/user').User;
const post = require('../models/post').Post;


router.use((req, res, next) => {
    if (req.user && req.path !== '/logout') {
        next();
    }
    res.redirect('/');
});

router.get('/', function (req, res, next) {
    res.render('posts/add', { title: 'El-Diario' });
});

router.get('/new', function (req, res, next) {
    res.render('posts/newpost');
});

// router.get("/new", (req, res, next) => {
//     res.render("posts/new",
//         { username: req.session.currentUser.username });
// });

module.exports = router;