'use strict';

const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'El-Diario' });
});

router.get('/menu', function (req, res, next) {
  res.render('menu', { title: 'El-Diario' });
});


router.get('/add', function (req, res, next) {
  res.render('add', { title: 'El-Diario' });
});


module.exports = router;
