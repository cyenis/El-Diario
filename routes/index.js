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

router.get('/map', function (req, res, next) {
  res.render('maps/single', { title: 'My Mapa' });
});

module.exports = router;
