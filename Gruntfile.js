// var debug = require('debug')('pook:grunt');

var path = require('path');
var promise = require('promised-io/promise');

var AWS = require('aws-sdk');
var Route53 = require('nice-route53');

var AWSu = require('./lib/aws_util.js');

var util = require('./lib/util.js');

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
				return util.fileMd5(fullPath);
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
								return AWSu.s3.deleteObject('photos', item.Key);
							}
						}
					)
				);
			}
		]);
		promise.when(seq,
			function success() {},
			function error(err) {
				console.log("unexpected error", err, err.stack());
			});
	});

	grunt.registerTask('netRegisterHostAs', function(hostname) {
		//var Route53 = require('nice-route53');
		var done = this.async();
		hostname = hostname || 'resize';

		promise.when( util.hostIp(),
			function success(ip) {
				var r53 = new Route53(AWS.config.credentials);
				var zones = r53.zones(function(err, domains) {
					if (err)
						return done(err);

					r53.setRecord( {
						zoneId: domains[0].zoneId,
						name: hostname + ".pook.io",
						type: 'A',
						ttl: 300,
						values: [ ip ]
					}, function(err, res) {
						console.log('registered ' + hostname + ' as ' + ip);
						// console.log(res);
						done(err);
					});
				});
			},
			function error(err) {
				done(err);
			}
		);	
	});

	grunt.registerTask('default', 'sdbListDomains');
};
