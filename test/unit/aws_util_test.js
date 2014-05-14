// aws_util_test.js

var assert = require("assert");
var path = require('path');
var promise = require('promised-io/promise');
var fs = require('promised-io/fs');

var AWSu = require ('../../lib/aws_util.js');
var utils = require ('../../lib/util.js');

describe('aws_util.js', function() {

	describe('s3', function() {
		it ('#uploadFile', function() {
			var s3 = AWSu.s3.connect('test');
			var src = path.resolve(__dirname, '../data/tiny.jpg');
			var key = "s3uploadFiletest-" + utils.randomString(6); 
			return promise.seq([
				function() { return AWSu.s3.uploadFile(s3, src, key)},
				function() { return AWSu.s3.deleteKey(s3, key) }
			]);
		});
	});

	describe('SimpleDB', function() {

		it ('#createDomain', function() {
			this.timeout(60 * 1000);
			var sdb = AWSu.sdb.connect();
			return promise.seq( [
				function() { return AWSu.sdb.deleteDomain(sdb, 'test') },
				function() { return AWSu.sdb.createDomain(sdb, 'test') }
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
			var sdb = AWSu.sdb.connect();
			var q = "select itemName() from test";
			var p = AWSu.sdb.select(sdb, q);
			// promise.when(p, 
			// 	function(data) {console.log(data)},
			// 	function(err) { console.log(err)} 
			// )
			return p;
		});

		it ('#createItem, #deleteItem', function() {
			this.timeout(20 * 1000);
			var sdb = AWSu.sdb.connect();
			
			return promise.seq([
				function() { // creation
					// console.log('creating item');
					return AWSu.sdb.createItem(sdb, 'test', "testItem", {
						first: "first",
						second: "second"
					});
				},
				function(data) { // create same item again, should fail
					// console.log("createItem data", data);
					var p = AWSu.sdb.createItem(sdb, 'test', "testItem", {
						first: "first",
						second: "second"
					});
					return utils.invertPromise(p);
				},
				function(err) { // delete the item
					// console.log("deleting item");
					return AWSu.sdb.deleteItem(sdb, 'test', 'testItem');
				},
			]);
		});

	});
});
