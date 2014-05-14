var AWSu = require('./lib/aws_util.js');
var promise = require('promised-io/promise');

module.exports = function(grunt) {
	
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json')
	});

	grunt.registerTask('sdbListDomains', function() {
		var done = this.async();
		var sdb = AWSu.sdb.connect();
		promise.when(  AWSu.sdb.listDomains(sdb), 
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

	grunt.registerTask('default', 'sdbListDomains');
};
