var express = require('express');
var users = require('./users');
var utils = require('../utils/app-utils');
var router = express.Router();

/*** GET Type URLs ***/
router.get('/', users.index);
router.get('/viewProfile', users.viewProfile);

/*** POST Type URLs ***/
router.post('/signIn', users.signIn);
router.post('/signUp', users.signUp);

module.exports = router;
