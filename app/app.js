var express = require('express');

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var bodyParser = require('body-parser');

var auth = require('./auth');

var app = express();

//every page starts a session
app.use(session({
	resave: false,
	saveUninitialized: false,
	secret: 'keyboard cat',
	store: new MongoStore({
		url: 'mongodb://localhost/NodeWebsite'
	})
}));

//every page has its body parsed
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//routing for the root page
app.get('/', function (req, res) {
  res.redirect('/index');
});

//routingg for the /index page
app.get('/index', function (req, res) {
  res.send('<p>Hello World!</p>');
});

//routing for the /home page
app.get('/home',auth.authenticate, function (req, res)
{
	res.send('Woot! You made it to the homepage! Wanna head on over to <a href="https://www.reddit.com">Reddit?</a><br/><br/><a href="/delete">Delete Me!</a>');
});

app.get('/login', function (req, res){
	res.send('<form action="/login" method="POST">Username:<br/><input type="text" name="username" required><br/>password:<br/><input type="password" name="passwd" required><br/><input type="submit" value="login"/></form>');
});

app.post('/login', auth.login);

app.get('/delete',auth.authenticate, function (req, res){
	res.send('<form action="/delete" method="POST">Username:<br/><input type="text" name="username" required><br/>password:<br/><input type="password" name="passwd" required><br/><label>Are you sure you want to delete your account?<input type="checkbox" required></label><br/><input type="submit" value="Delete Me!"/></form>')
})

app.post('/delete',auth.delete);

app.get('/register', function (req, res){
	res.send('<form action="/register" method="POST">Username:<br/><input type="text" name="username"><br/>password:<br/><input type="password" name="passwd"><br/><input type="submit" value="register"/></form>')
})
app.post('/register', auth.register);

app.use(function(req, res){
	res.status(404).send("Whoops! I dont know a page by that name.");
});
module.exports = app;