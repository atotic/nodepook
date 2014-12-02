
var async = require('async');
var debug = require('debug')('pook:routes:users');
var express = require('express');

var Photo = require('../common/Photo.js');

var router = express.Router();

/* GET user home page */

router.get('/', function(req, res) {
	if (!req.user)
		res.render('user/account');
	else {
		async.waterfall([
				function getPhotos(cb) {
					Photo.photosByUserId(req.user.itemId, cb);
				},
				function render(photos, cb) {
					res.render('user/home', { 
						title: 'pook.io', 
						user: req.user,
						photos: photos
					});
					cb();
				}
			],
			function complete(err) {
				if (err)
					next(err);
			}
		);
	}
});



module.exports = router;
