var should = require('chai').should()
var Browser = require('zombie')
var http = require('http')

var requireHelper = require('../require_helper')
var app = requireHelper('app')

var browser = {}
describe('acceptance', function(){
	before(function(done) {
		Browser.localhost('nodewebsite.com', 8000)
		browser = Browser.create()
		this.server = app.listen(8000,done)
	})
	describe('/', function(){
		it('should redirect to /index', function(){
			browser.visit('/', function(){
				browser.assert.redirected()
				browser.assert.url('/index')
				browser.assert.success()
			})
		})
	})
	describe('/home', function(){
		it('should only show the homepage if the user is authenticated')
		it('should show a login link if the user is not authenticated')
	})
	describe('/index', function(){
		it('should have an index page', function(){
			browser.visit('/index', function(){
				browser.assert.success()
			})
		})
		it('should have a message on the page', function(){
			browser.visit('/index', function(){
				browser.assert.text('body', 'Hello World!')
			})
		})
	})
	describe('/login', function(){
		it('should allow users to enter a username and password')
	})
	describe('/register', function(){
		it('should have a register page', function(){
			browser.visit('/register', function(){
				browser.assert.success()
			})
		})
	})
	after(function() {
		this.server.close()
	})	
})