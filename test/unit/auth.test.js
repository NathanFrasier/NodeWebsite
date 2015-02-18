var should = require('chai').should()
var assert = require('chai').assert

var MongoClient = require('mongodb').MongoClient;
var requireHelper = require('../../require_helper')
var auth = requireHelper('auth')

describe('auth', function(){
	describe('authenticate', function(){
		it('should call the next function if the request is from a logged in user', function(done){
			var req = {}
			req.session = {}
			var res = {}
			req.session.loggedin = true
			auth.authenticate(req, res, function(req, res){
				done();
			})
		})
		it('should not call the next function if the request is not from a logged in user', function(done){
			var req = {}
			req.session = {}
			req.session.loggedin = false
			var res = {}
			res.send = function(value){
				done()
			}
			auth.authenticate(req, res, function(req, res){
				throw new Exception();
			})
		})
	})
	describe('registerCredentials', function(){
		it('should not add a new user if the username is already taken', function(done){
			auth.registerCredentials('admin','pass', function(success, msg){
				success.should.equal(false)
				MongoClient.connect('mongodb://localhost/NodeWebsite', function(err, db){
					if(err) {
						return console.dir(err);
					}
					var collection = db.collection('users');
					collection.count({'username':'admin'},function(err, count){
						if(err) {
							return console.dir(err);
						} else {
							count.should.equal(1)
							done()
						}
					})
				})
			})
		})
		it('should not allow registration if a password is not secure', function(done){
			auth.registerCredentials('newUser1337','', function(success, msg){
				success.should.equal(false)
				MongoClient.connect('mongodb://localhost/NodeWebsite', function(err, db){
					if(err) {
						return console.dir(err);
					}
					var collection = db.collection('users');
					collection.count({'username':'admin'},function(err, count){
						if(err) {
							return console.dir(err);
						} else {
							count.should.equal(1)
							done()
						}
					})
				})
			})	
		})
		it('should add a new entry to the database when a valid username and password are given', function(done){
			auth.registerCredentials('newUser1337','admin', function(success, msg){
				MongoClient.connect('mongodb://localhost/NodeWebsite', function (err, db){
					if(err) {
						return console.dir(err);
					}
					var collection = db.collection('users');
					collection.findOne({'username':'newUser1337'},{'passwd':1},function(err, result){
						if(err) {
							return console.dir(err);
						}
						if(result) {
							result.passwd.should.equal('admin')
							//pass
							/*****start cleanup*****/
							db.collection('users').remove({'username':'newUser1337'},true, function(){
								done()
							})
							/*****end cleanup*****/

						} else {
							//fail
							assert.fail("the user should exist")
						}
					})
				})
			})
		})
		
	})
	describe('securePassword', function(){
		it('should call empty string passwords unsecure', function(){
			auth.securePassword('').should.equal(false)
		})
	})
	describe('validCredentials', function(){
		it('should return true for valid admin credentials', function(done){
			auth.validCredentials('admin','admin', function(isValid){
				isValid.should.equal(true)
				done()
			})
		})
		it('should return false for valid username and invalid password', function(done){
			auth.validCredentials('admin','INvaLidP4$$word', function(isValid){
				isValid.should.equal(false)
				done()
			})
		})
		it('should return false for invalid username and password', function(done){
			auth.validCredentials('InvalidUZER','passwd', function(isValid){
				isValid.should.equal(false)
				done()
			})
		})
		it('should return false for invalid parameter types', function(done){
			auth.validCredentials(true,false, function(isValid){
				isValid.should.equal(false)
				done()
			})
		})
	})
})