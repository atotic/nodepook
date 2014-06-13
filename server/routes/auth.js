var debug = require('debug')('pook:routes:auth');

var async = require('async');
var bcrypt = require('bcrypt');
var express = require('express');
var localStrategy = require('passport-local').Strategy;
var passport = require('passport');

/**
 * User model
 *
 * fields:
 * email
 * password: encrypted with bcrypt
 */
var User = {
	create: function(email, password, done) {

	}
}

var router = express.Router();
router.post('/login', function(req, res, next) {

});

module.exports = router;
