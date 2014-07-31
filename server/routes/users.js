var express = require('express');

var auth = require('./auth');

var router = express.Router();

router.use(auth.loadUserFromCookie);
/* GET user home page */

router.get('/', function(req, res) {
	if (!req.user)
		res.redirect('/');
	res.render('users/home', { title: 'pook.io', user: req.user});
});

module.exports = router;
