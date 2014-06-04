// aws_util_test.js
"use strict";
var assert = require("assert");
var async = require('async');
var fs = require('fs');
var gm = require('gm');
var path = require('path');

var AWSu = require ('../../lib/aws_util.js');
var util = require ('../../lib/util.js');
var photoUtil = require('../../lib/photo_util.js');

describe('aws_util.js', function() {

	describe('s3', function() {

		it('#putObject buffer', function(done) {
			this.timeout(4*1000);
			var src = path.resolve(__dirname, '../data/tiny.jpg');
			var key = "s3uploadStreamtest-" + util.randomString(6);
			async.waterfall([
					function read(callback) {
						fs.readFile(src, callback);
					},
					function upload(buffer, callback) {
						AWSu.s3.client.putObject({
								Bucket: AWSu.buckets.test,
								Key: key,
								Body: buffer
							},
							callback
						);
					},
					function del(data, callback) {
						return callback();
						AWSu.s3.client.deleteObject( {
								Bucket: AWSu.buckets.test,
								Key: key
							},
							callback
						);
					}
				],
				function(err, ignore) {
					done(err);
				}
			);
		});

		it ('#putObject stream', function(done) {
			this.timeout(4*1000);
			var src = path.resolve(__dirname, '../data/tiny.jpg');
			var key = "s3uploadStreamtest-" + util.randomString(6);
			async.waterfall([
					function upload(callback) {
						AWSu.s3.client.putObject( {
								Bucket: AWSu.buckets.test,
								Key: key,
								Body: fs.createReadStream(src)
							},
							callback
						)
					},
					function del(data, callback) {
						AWSu.s3.client.deleteObject( {
							Bucket: AWSu.buckets.test,
							Key: key
						},
						callback);
					}
				],
				function(err, ignore) {
					done(err);
				}
			)
		});

		it ('listObjects', function(done) {
			AWSu.s3.client.listObjects({
					Bucket: AWSu.buckets.photos,
					Delimiter: '/'
				},
				done
			);
		});

		it ('#headObject', function(done) {
			var p = AWSu.s3.client.headObject({
					Bucket: AWSu.buckets.photos,
					Key:'404.jpg'
				}, done);
		});

		it ('#getObject', function(done) {
			AWSu.s3.client.getObject({
					Bucket: AWSu.buckets.photos,
					Key: '404.jpg'
				},
				done
			);
		});

	});

	describe('Metadata', function() {
		// it.skip ('#request', function() {
		// 	return AWSu.metadata.request('/latest/meta-data/public-ipv4');
		// });
	});

	describe('SimpleDB', function() {

		it ('#createDomain', function(done) {
			this.timeout(60 * 1000);
			async.waterfall( [
				function(cb) { AWSu.sdb.deleteDomain( { DomainName: 'test'}, cb )},
				function(ignore, cb) { AWSu.sdb.createDomain( { DomainName: 'test'}, cb )}
				],
				done
			);
		});

		it ('#uniqueId', function() {
			var id1 = AWSu.uniqueId();
			var id2 = AWSu.uniqueId();
			assert(id1.length > 10);
			assert(id1 != id2);
		});

		it ('#select', function(done) {
			this.timeout(60 * 1000);
			// var q = "select itemName() from photos where md5='a7aea1d663adc76b9269ec6f0c1b8e15'";
			var p = AWSu.sdb.select({
					SelectExpression:  "select itemName() from test",
					ConsistentRead: true
				},
				done
			);
		});

		it ('#createItem, #deleteItem', function(done) {
			this.timeout(20 * 1000);
			async.waterfall([
					function createItem(cb) {
						AWSu.sdb.putAttributes( {
							DomainName: AWSu.domains.test,
							ItemName: 'testItem',
							Attributes: AWSu.objectToAttributes({ first: 'first', second: 'second'})
							},
							cb
						);
					},
					function createDuplicate(ignore, cb) {
						AWSu.sdb.putAttributes( {
							DomainName: AWSu.domains.test,
							ItemName: 'testItem',
							Attributes: AWSu.objectToAttributes({ first: 'first', second: 'second'}),
							Expected: { Name: 'first', Exists: false}
							},
							util.invertCallback(cb)
						);
					},
					function deleteItem(ignore, cb) {
						AWSu.sdb.deleteAttributes( {
							DomainName: AWSu.domains.test,
							ItemName: 'testItem'
							},
							cb
						);
					}
				],
				function(err) {
					done(err);
				}
				);
		});

	});
});
