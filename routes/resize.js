// resizer.js -- on-demand image resize module

var debug = require('debug')('pook:routes:resize');

var express = require('express');
var path = require('path');
var promise = require('promised-io/promise');
var fs = require("promised-io/fs").fs;
var gm = require('gm');

var AWSu = require ('../lib/aws_util.js');
var photoUtil = require('../lib/photo_util.js');
var util = require('../lib/util.js')

var router = express.Router();

router.get('/stats', function stats(req, res, next) {
	return promise.seq([
		function() { return AWSu.s3.listBuckets('photos') },
		]);
});

var ALLOWED_SIZES = [256, 1024];

router.get('*', function conversion(req, res, next) {
	var size = parseInt(req.param('size'));
	if (!size || ALLOWED_SIZES.indexOf(size) == -1)
		return res.send(400, "invalid size " + req.param('size'));

	var s3key = req.path;
	s3key = s3key.slice(1);
	var s3resizedKey = s3key + "?size=" + size;

	function resizeAndUpload() {
		var imageBuffer;
		var contentType;

		var seq = promise.seq([
			function fetch() { 
				debug('fetch', s3key); 
				return AWSu.s3.getObject('photos', s3key);
			},
			function resize(data) {
				debug('resize');
				if (data == null) {
					debug("resize: could not fetch s3key", s3key);
					return util.createRejectedPromise('s3 key not found');
				}
				else {
					debug("resizing")
					contentType = data.ContentType;
					return photoUtil.gmToBufferPromise(
						// resize image to 3:2 rect with size maxHeight, keep aspect
						// convert resized image to buffer
						gm(data.Body).resize(size * 1.34, size, '>')
					);
				}
			},
			function upload(buffer) {
				debug('upload');
				imageBuffer = buffer;
				return AWSu.s3.putObject('photos', s3resizedKey, buffer);					
			},
			function render(x) {
				debug('render ');
				res.type(contentType);
				res.send(imageBuffer);
			}
		]);
		promise.when(seq,
			function() {},
			function(err) { 
				debug("seq error", err);
				next(err);
			}
		);
	}

	promise.when( AWSu.s3.headObject('photos', s3resizedKey),
		function success(data) {
			debug('head exists, redirect');
			res.redirect( photoUtil.photoHostUrl + s3resizedKey);
		},
		function error(err) { // does not exist
			debug('head does not exist', s3resizedKey);
			resizeAndUpload();
		}
	);
});

module.exports = router;
