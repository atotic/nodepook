// resizer.js -- on-demand image resize module

/*
// routing rules for the bucket that redirect to this server
<RoutingRules>
<RoutingRule>
<Condition>
<HttpErrorCodeReturnedEquals>404</HttpErrorCodeReturnedEquals>
</Condition>
<Redirect>
<HostName>dev.pook.io</HostName>
<ReplaceKeyPrefixWith>resize/</ReplaceKeyPrefixWith>
</Redirect>
</RoutingRule>
</RoutingRules>
*/
var debug = require('debug')('pook:routes:resize');
"use strict";

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

/** 
 * path is /s3key$size
 * @returns { key: , size: }
 */
function pathToKeySize(path) {
	var m = path.split( photoUtil.separator );
	return { key: m[0].slice(1), size: parseInt(m[1]) }
}

router.get('*', function conversion(req, res, next) {
	var ks = pathToKeySize(req.path);
	if (!ks.size || ALLOWED_SIZES.indexOf(ks.size) == -1)
		return res.send(400, "invalid size " + ks.size);

	var s3resizedKey = ks.key + photoUtil.separator + ks.size;

	function resizeAndUpload() {
		var imageBuffer;
		var contentType;
		var seq = promise.seq([
			function fetch() { 
				debug('fetch', ks.key); 
				return AWSu.s3.getObject('photos', ks.key);
			},
			function resize(data) {
				debug('resize');
				if (data == null) {
					debug("resize: could not fetch ks.key", ks.key);
					return util.createRejectedPromise('s3 key not found');
				}
				else {
					debug("resizing")
					contentType = data.ContentType;
					return photoUtil.gmToBufferPromise(
						// resize image to 3:2 rect with size maxHeight, keep aspect
						// convert resized image to buffer
						gm(data.Body).resize(ks.size * 1.34, ks.size, '>')
					);
				}
			},
			function upload(buffer) {
				debug('upload');
				imageBuffer = buffer;
				res.type(contentType);
				res.send(imageBuffer);
				return AWSu.s3.putObject('photos', {
					Key: s3resizedKey, 
					Body: buffer,
					ContentType: contentType,
					StorageClass: 'REDUCED_REDUNDANCY'
				});
			},
			function render(x) {
				debug('render ');
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
			debug('head exists, redirect to ', photoUtil.hostUrl + s3resizedKey);
			res.redirect( photoUtil.hostUrl + s3resizedKey);
		},
		function error(err) { // does not exist
			debug('head does not exist', s3resizedKey);
			resizeAndUpload();
		}
	);
});

module.exports = router;
