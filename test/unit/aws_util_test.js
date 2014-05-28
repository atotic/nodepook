// aws_util_test.js

var assert = require("assert");
var path = require('path');
var promise = require('promised-io/promise');
var fs = require('fs');
var promiseFs = require('promised-io/fs');

var AWSu = require ('../../lib/aws_util.js');
var utils = require ('../../lib/util.js');
var photoUtil = require('../../lib/photo_util.js');
var gm = require('gm');

describe('aws_util.js', function() {

	describe('s3', function() {

		it('#putObject buffer', function() {
			this.timeout(4*1000);
			var src = path.resolve(__dirname, '../data/tiny.jpg');
			var key = "s3uploadStreamtest-" + utils.randomString(6); 
			return promise.seq([
				function() { return promiseFs.readFile(src) },
				function(data) { 
					return AWSu.s3.putObject('test', {
						Key: key,
						Body: data
					});
				},
				function() { return AWSu.s3.deleteObject('test', key) }
			]);
		});

		it ('#putObject stream', function() {
			this.timeout(4*1000);
			var src = path.resolve(__dirname, '../data/tiny.jpg');
			var key = "s3uploadStreamtest-" + utils.randomString(6); 
			return promise.seq([
				function() { 
					return AWSu.s3.putObject('test', {
						Key: key, 
						Body: fs.createReadStream(src) 
					});
				},
				function() { return AWSu.s3.deleteObject('test', key) }
			]);
		});

		it ('listObjects', function() {
			var p = AWSu.s3.listObjects('photos');
			// promise.when(p, function(data) { console.log(data)}, function(){});
			return p;
		});

		it ('#headObject', function() {
			var p = AWSu.s3.headObject('photos', '404.jpg');
			//promise.when(p, function(data) { console.log(data)}, function(){});
			return p;
		});

		it ('#getObject', function() {
			return AWSu.s3.getObject('photos', '404.jpg');
		});

	});

	describe('Metadata', function() {
		it.skip ('#request', function() {
			return AWSu.metadata.request('/latest/meta-data/public-ipv4');
		});
	});

	describe('SimpleDB', function() {

		it ('#createDomain', function() {
			this.timeout(60 * 1000);
			return promise.seq( [
				function() { return AWSu.sdb.deleteDomain('test') },
				function() { return AWSu.sdb.createDomain('test') }
			]);
		});

		it ('#uniqueId', function() {
			var id1 = AWSu.uniqueId();
			var id2 = AWSu.uniqueId();
			assert(id1.length > 10);
			assert(id1 != id2);
		});

		it ('#select', function() {
			this.timeout(60 * 1000);
			// var q = "select itemName() from photos where md5='a7aea1d663adc76b9269ec6f0c1b8e15'";
			var q = "select itemName() from test";
			var p = AWSu.sdb.select(q);
			// promise.when(p, 
			// 	function(data) {console.log(data)},
			// 	function(err) { console.log(err)} 
			// )
			return p;
		});

		it ('#createItem, #deleteItem', function() {
			this.timeout(20 * 1000);
			
			return promise.seq([
				function() { // creation
					// console.log('creating item');
					return AWSu.sdb.createItem('test', "testItem", {
						first: "first",
						second: "second"
					});
				},
				function(data) { // create same item again, should fail
					// console.log("createItem data", data);
					var p = AWSu.sdb.createItem('test', "testItem", {
						first: "first",
						second: "second"
					});
					return utils.invertPromise(p);
				},
				function(err) { // delete the item
					// console.log("deleting item");
					return AWSu.sdb.deleteItem('test', 'testItem');
				},
			]);
		});

	});
});
