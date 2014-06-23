var debug = require('debug')('pook:test:auth');
var request = require('supertest');

var async = require('async');

var app = require('../instances/app.js');
var db = require('../common/db.js');
var AWSu = require('../common/aws_util.js');


describe('/register', function() {

	it ('fails when pw too short', function(done) {
		request(app)
			.post('/auth/register')
			.set('Accept', 'application/json')
			.send({ email: 'test@totic.org', password: 'what' })
			.expect(422)
			.expect('Content-Type', /json/)
			.expect( function( response) { 
				if(!response.body.formMessages.password) return "need pw err msg"
			})
			.end( function(err, response) {
				done(err);
			}
			);
	});

	it ('success ', function(done) {
		request(app)
			.post('/auth/register')
			.type('form')
			.send({ email: 'test6@totic.org'})
			.send({ password: 'goodpassword'})
			.set('Accept', 'application/json')
			.expect(function(response) {
				if (!response.body.data.id) {
					return "register should return user id";
				}
			})
			.expect(200)
			.expect('Content-Type', /json/)
			.end( function(err, response) {
				if (err)
					return done(err);
				AWSu.sdb.deleteAttributes( {
					DomainName: AWSu.domains.users,
					ItemName: response.body.data.id
				}, done);
			});
	});

});
