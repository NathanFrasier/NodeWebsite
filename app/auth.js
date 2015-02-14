var MongoClient = require('mongodb').MongoClient;
var auth = {};

auth.authenticate = function(req, res, next){
	if(req.session.loggedin) {
		next();
	} else {
		res.statusCode = 403;
		res.send('<h1>Sorry!</h1><p>You are not authenticated.</p><br/><p>You need to be <a href="/login">logged in</a> to access this page.<p>');
	}
};

auth.login = function (req, res){
	auth.validCredentials(req.body.username,req.body.passwd, function(isValid){
		if(isValid) {
			req.session.loggedin = true;
			res.send('You have sucessfully logged in. Welcome!');
		} else {
			res.send('Your login has failed, are you <a>registered?</a>');
		}
	});
};
auth.register = function (req, res){
	//build register page
}
auth.validCredentials = function(username, passwd, callback){
	MongoClient.connect('mongodb://localhost/NodeWebsite', function (err, db) {
		if(err) {
			return console.dir(err);
		}
		var collection = db.collection('users');
		collection.findOne({'username':username},{'passwd':1},function(err, result){
			if(err) {
				return console.dir(err);
			}
			if(result === null){
				callback(false);
			} else {
				if(result.passwd === passwd) {
					callback(true);
				} else {
					callback(false);
				}
			}
			
		});
	});
};

module.exports = auth;