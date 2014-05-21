var debug = require('debug')('pook:grunt');
var AWSu = require('./lib/aws_util.js');
var promise = require('promised-io/promise');
var utils = require('./lib/util.js');
var path = require('path');

module.exports = function(grunt) {
"use strict";

	grunt.loadNpmTasks('grunt-debug');
	
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json')
	});

	grunt.registerTask('sdbListDomains', function() {
		var done = this.async();
		promise.when(  AWSu.sdb.listDomains(), 
			function(data) {
//				console.log('domains:');
//				data['DomainNames'].forEach( function(x) { console.log(x )});
				console.log(data);
				done();
			},
			function(err) {
				console.log(err);
				done(err);
			}
		);
	});

// grunt deletePhotosMatching:./test/data/orient3.jpg
	grunt.registerTask('deletePhotosMatching', function(filePath) {
		var done = this.async();
		var fullPath = path.resolve(__dirname, filePath);
		var seq = promise.seq([
			function() {
				return utils.fileMd5(fullPath);
			},
			function(md5) {
				return AWSu.sdb.select("select itemName() from photos where md5='" + md5 + "'");
			},
			function(data) {
				if ('Items' in data) {
					var all = [];
					return promise.all ( data.Items.map( function( item ) {
						debug('Deleting ', item.Name);
					}));
				}
				return true;
			}
		]);
	});

	grunt.registerTask('readItem', function(domain, itemId) {
		var done =  this.async();

		promise.when( AWSu.sdb.readItem(domain, itemId), 
			function success(data) {
				console.log(data);
				done();
			},
			function fail(err) {
				console.log(err);
				done(err);
			}
			);
	});

	grunt.registerTask('deleteItem', function(domain, itemId) {
		var done =  this.async();

		promise.when( AWSu.sdb.deleteItem(domain, itemId), 
			function success(data) {
				console.log(data);
				done();
			},
			function fail(err) {
				console.log(err);
				done(err);
			}
			);
	});

	grunt.registerTask('dumpDomain', function(domain) {
		var done =  this.async();
		promise.when( AWSu.sdb.select('select * from ' + domain), 
			function success(data) {
				console.log(data);
				done();
			},
			function fail(err) {
				console.log(err);
				done(err);
			}
			);
	});

	grunt.registerTask('cleanDomain', function(domain) {
		var done =  this.async();
		var seq = promise.seq([
			function() { 
				return AWSu.sdb.select('select itemName() from ' + domain) 
			},
			function(data) {
				if (!('Items' in data))
					return;
				var deletions = data.Items.map( function(item) { 
					debug('deleting', item.Name);
					return AWSu.sdb.deleteItem(domain, item.Name);
				});
				return promise.all(deletions);
			}
			]);
		promise.when(seq,
			function() { done()},
			function(err) { done(err)}
		);
	});

	grunt.registerTask('eraseDatabases', function() {
		var done = this.async();
		var seq = promise.seq( [
			// erase sdb photos domain
			function sdbSelect() { return AWSu.sdb.select('select itemName() from photos')},
			function sdbDelete(data) {
				if (!('Items' in data))
					return;
				var deletions = data.Items.map( function(item) { 
					debug('deleting sdb ', item.Name);
					return AWSu.sdb.deleteItem('photos', item.Name);
				});
				return promise.all(deletions);
			},
			function s3list() {
				return AWSu.s3.listObjects('photos');
			},
			function s3delete(data) {
				return promise.all(
					data.map(
					 	function(item) {
							if ( ['404.jpg', 'index.jpg'].indexOf(item.Key) == -1) {
								debug('deleting s3 ', item.Key);
								return AWSu.s3.deleteKey('photos', item.Key);
							}
						}
					)
				);
			}
		]);
	
	});

	grunt.registerTask('default', 'sdbReadItem');
};
