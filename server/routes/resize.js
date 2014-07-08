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

var async = require('async');
var express = require('express');
var fs = require("fs");
var gm = require('gm');
var path = require('path');

var AWSu = require ('../common/aws_util.js');
var Photo = require('../common/Photo.js');
var util = require('../common/util.js')

var router = express.Router();

router.get('/stats', function stats(req, res, next) {
	AWSu.s3.listBuckets(function(err, data) {
		if (err)
      return next(err);
    res.render('dev', {message: 'listBuckets', payload: data});
	});
});

var ALLOWED_SIZES = [256, 1024];

/**
 * path is /s3key$size
 * @returns { key: , size: }
 */
function pathToKeySize(path) {
	var m = path.split( Photo.separator );
	return { key: m[0].slice(1), size: parseInt(m[1]) }
}

router.get('*', function conversion(req, res, next) {
	var ks = pathToKeySize(req.path);
	if (!ks.size || ALLOWED_SIZES.indexOf(ks.size) == -1)
		return res.send(400, "invalid size " + ks.size);

	var s3resizedKey = ks.key + Photo.separator + ks.size;

	function resizeAndUpload() {
		var imageBuffer;
		var contentType;
		async.waterfall(
			[
				function fetch(fn) {
					debug('fetch', ks.key);
					AWSu.s3.client.getObject({
							Bucket: AWSu.buckets.photos,
							Key: ks.key
						},
						fn);
				},
				function resize(data, fn) {
					debug('resize');
					if (data == null) {
						debug("resize: could not fetch ks.key", ks.key);
						fn( new Error('s3 key not found ' + ks.key));
					}
					else {
						debug("resizing")
						contentType = data.ContentType;
						// resize image to 3:2 rect with size maxHeight, keep aspect
						// convert resized image to buffer
						gm(data.Body).resize(ks.size * 1.34, ks.size, '>').toBuffer(fn);
					}
				},
				function upload(buffer, fn) {
					debug('upload');
					imageBuffer = buffer;
					// render
					res.type(contentType);
					res.send(imageBuffer);
					// upload
					AWSu.s3.putObject({
							Bucket: AWSu.buckets.photos,
							Key: s3resizedKey,
							Body: buffer,
							ContentType: contentType,
							StorageClass: 'REDUCED_REDUNDANCY'
						},
						fn
					);
				}
			],
			function(err, ignore) {
				if (err)
					next(err);
			}
		);
	}

	AWSu.s3.client.headObject( {
			Bucket: AWSu.buckets.photos,
			Key: s3resizedKey
		},
		function(err, data) {
			if (err) {
				debug('head does not exist', s3resizedKey);
				resizeAndUpload();
			}
			else {
				debug('head exists, redirect to ', Photo.hostUrl + s3resizedKey);
				res.redirect( Photo.hostUrl + s3resizedKey);
			}
		}
	);
});

module.exports = router;
