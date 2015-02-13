var should = require('chai').should()

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