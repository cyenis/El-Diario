'use strict';

const express = require('express');
const passport = require('passport');
const router = express.Router();

const ensureLogin = require("connect-ensure-login");

const user = require('../models/user').User;
const post = require('../models/post').Post;


const bcryptSalt = 10;

router.use((req, res, next) => {
    if (req.user && req.path !== '/logout') {
        res.redirect('/');
    }
    next();
});

router.get('/', function (req, res, next) {
    const data = {
        message: req.flash('error')
    };
    res.render('posts/index/', data);
});

// router.get("/new", (req, res, next) => {
//     res.render("posts/new",
//         { username: req.session.currentUser.username });
// });

module.exports = router;