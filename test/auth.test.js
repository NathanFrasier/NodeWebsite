var should = require('chai').should()
var auth = require('../auth')

describe('auth.js', function(){
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