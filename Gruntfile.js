// This gruntfile is ugly. I have not idea how to make pretty grunt
// https://github.com/angular/angular.js/blob/master/Gruntfile.js should inspire me to do better

var debug = require('debug')('pook:grunt');

"use strict";

var async = require('async');
var AWS = require('aws-sdk');
var path = require('path');
var Route53 = require('nice-route53');

var AWSu = require('./server/common/aws_util.js');
var util = require('./server/common/util.js');

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
			done(err);
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
			done(err);
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
		console.log('SDB clean domain', domain);
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
						return cb();
					async.map(data.Items, function(item, callback) {
						console.log("deleting item ", item.Name);
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

	grunt.registerTask('cleanBucket', function(bucket) {
		console.log('S3 clean bucket: ', bucket);

		var done = this.async();
		async.waterfall([
				function listBucket(cb) {
					AWSu.s3.client.listObjects({
						Bucket: bucket,
						Delimiter: '/'
					},
					cb);
				},
				function deleteKeys(data, cb) {
					async.map(data.Contents, function(item, callback) {
							if ( ['404.jpg', 'index.jpg'].indexOf(item.Key) == -1) {
								console.log('deleting key ', item.Key);
								AWSu.s3.client.deleteObject(
									{
										Bucket: bucket,
										Key: item.Key
									},
									callback);
							}
							else
								callback();
						},
						cb
					);
				}			
			],
			function complete(err) {
				if (err)
					console.log("Have error", err);
				done(err);
			}
		);
	});

	grunt.registerTask('select', function() {
		var done = this.async();
		AWSu.sdb.select({
			SelectExpression: 'select ownerId from photos '
		}, function(err, response) {
			console.log(response);
			if ('Items' in response) {
				for (var i=0; i<response.Items.length; i++) {
					console.log(response.Items[i].Name);
					var attrs = response.Items[i].Attributes;
					for (var j=0; j<attrs.length; j++)
						console.log(attrs[j].Name, ':', attrs[j].Value);
				}
			}
			done(err, response);
		});
	});

	grunt.registerTask('eraseEverything', ['cleanBucket:pookio-test', 'cleanDomain:photos', 'cleanDomain:users']);

	grunt.registerTask('netRegisterHostAs', function(hostname) {

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
