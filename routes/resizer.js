// resizer.js -- on-demand image resize module

var debug = require('debug')('pook:routes:resizer');

var express = require('express');
var path = require('path');
var promise = require('promised-io/promise');
var fs = require("promised-io/fs").fs;

var AWSu = require ('../lib/aws_util.js');
var photoUtil = require('../lib/photo_util.js');
var db = require('../lib/db.js');

var router = express.Router();

router.get('/stats', function stats(req, res, next) {
	return promise.seq([
		function() { return AWSu.s3.listBuckets('photos') },
		]);
});
