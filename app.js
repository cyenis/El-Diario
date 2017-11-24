'use strict';

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const MongoStore = require('connect-mongo')(session);

const configurePassport = require('./helpers/passport');
const index = require('./routes/index');
const auth = require('./routes/auth');
const profile = require('./routes/profile');
const add = require('./routes/add');
const timeline = require('./routes/timeline');
const explore = require('./routes/explore');

const app = express();

// -- setup the app  -----------------------

// - session   -----------------------

app.use(session({
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 // 1 day
  }),
  secret: 'some-string',
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// - passport

configurePassport();
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// - database  -----------------------

mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/ELDiario', {
  keepAlive: true,
  reconnectTries: Number.MAX_VALUE,
  useMongoClient: true
});

// - views  -----------------------
app.use(expressLayouts);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', 'layouts/main');

// - other middlewares -----------------------

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// -- app middlewares

app.use((req, res, next) => {
  res.locals = {
    user: req.user
  };
  next();
});

// -- routes
app.use('/', index);
app.use('/auth', auth);
app.use('/profile', profile);
app.use('/add', add);
app.use('/timeline', timeline);
app.use('/explore', explore);

// -- 404 and error handler

// NOTE: requires a views/not-found.ejs template
app.use(function (req, res, next) {
  res.status(404);
  res.render('not-found');
});

// NOTE: requires a views/error.ejs template
app.use(function (err, req, res, next) {
  // always log the error
  console.error('ERROR', req.method, req.path, err);

  // only render if the error ocurred before sending the response
  if (!res.headersSent) {
    res.status(500);
    res.render('error');
  }
});

module.exports = app;
