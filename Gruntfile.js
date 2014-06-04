var debug = require('debug')('pook:grunt');

"use strict";

var async = require('async');
var AWS = require('aws-sdk');
var path = require('path');
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
		AWSu.sdb.listDomains({}, function(err, data) {
			console.log(data);
			done(err, data);
		});
	});

	grunt.registerTask('readItem', function(domain, itemId) {
		var done =  this.async();

		AWSu.sdbReadItem( domain, itemId, function(err, item) {
			if (err)
				console.error(err);
			else
				console.log(item);
		});
	});

	grunt.registerTask('deleteItem', function(domain, itemName) {
		var done =  this.async();
		AWSu.sdb.deleteAttributes({
			DomainName: domain,
			ItemName: itemName
		}, function(err, data) {
			if (err)
				console.error(err);
			else
				console.log(data);
			done()
		});
	});

	grunt.registerTask('dumpDomain', function(domain) {
		var done =  this.async();
		AWSu.sdb.select(
			{
				SelectExpression: 'select * from ' + domain
			},
			function(err, data) {
				console.log(data);
			done(err);
		});
	});

	grunt.registerTask('cleanDomain', function(domain) {
		var done =  this.async();
		async.waterfall(
			[
				function selectItems(cb) {
					AWSu.sdb.select({
						SelectExpression: 'select itemName() from ' + domain
					}, cb);
				},
				function deleteItems(data, cb) {
					if (!('Items' in data))
						return;
					async.map(data.Items, function(item, callback) {
						AWSu.sdb.deleteAttributes(
							{
								DomainName: domain,
								ItemName: item.Name
							},
							callback
						)
					}, cb);
				}
			],
			done);
	});

	grunt.registerTask('eraseDatabases', function() {
		var done = this.async();
		async.waterfall(
			[
				function selectItems(cb) {
					debug('selectItems');
					AWSu.sdb.select({
						SelectExpression: 'select itemName() from photos'
					}, cb);
				},
				function deleteItems(data, cb) {
					debug('deleteItems');
					if (!('Items' in data))
						return cb(null, null);
					async.map(data.Items, function(item, callback) {
						console.log('deleting item ', item.Name);
						AWSu.sdb.deleteAttributes(
							{
								DomainName: 'photos',
								ItemName: item.Name
							},
							callback
						)
					}, cb);
				},
				function listBucket(ingore, cb) {
					debug('listBucket');
					AWSu.s3.client.listObjects({
						Bucket: AWSu.buckets.photos,
						Delimiter: '/'
					},
					cb);
				},
				function deleteKeys(data, cb) {
					debug('deleteKeys');
					async.map(data.Contents, function(item, callback) {
						if ( ['404.jpg', 'index.jpg'].indexOf(item.Key) == -1) {
							console.log('deleting key ', item.Key);
							AWSu.s3.client.deleteObject(
								{
									Bucket: AWSu.buckets.photos,
									Key: item.Key
								},
								callback);
						}
					});
				}
			],
			function(err, ignore) {
				console.log("done");
				if (err)
					console.error(err);
				done(err);
			});
	});

	grunt.registerTask('netRegisterHostAs', function(hostname) {
		//var Route53 = require('nice-route53');
		var done = this.async();
		hostname = hostname || 'resize';

		var r53 = new Route53(AWS.config.credentials);
		var hostAddress;
		async.waterfall([
			function getIp(cb) {
				util.hostIp(cb);
			},
			function getZones(ip, cb) {
				hostAddress = ip;
				r53.zones(cb);
			},
			function setRecord(domains, cb) {
				r53.setRecord( {
						zoneId: domains[0].zoneId,
						name: hostname + ".pook.io",
						type: 'A',
						ttl: 300,
						values: [ hostAddress ]
					});
			},
			function showMessage(cb) {
				console.log('registered ' + hostname + ' as ' + ip);
				cb();
			}
			],done);
	});

	grunt.registerTask('default', 'sdbListDomains');
};
