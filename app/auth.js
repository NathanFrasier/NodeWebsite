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
	auth.validCredentials(req.body.username,req.body.passwd, function (isValid){
		if(isValid) {
			req.session.loggedin = true;
			res.send('You have sucessfully logged in. Welcome!');
		} else {
			res.send('Your login has failed, are you <a>registered?</a>');
		}
	});
};
auth.delete = function (req, res){
	auth.validCredentials(req.body.username,req.body.passwd, function (isValid){
		if(isValid) {
			req.session.loggedin = false;
			MongoClient.connect('mongodb://localhost/NodeWebsite', function (err, db){
				if(err) {
					return console.dir(err);
				}
				var collection = db.collection('users');
				collection.remove({"username" : req.body.username}, true, function(err){
					res.send('You have successfully deleted your account. We\'ll miss you!')
				})
			})
		} else {
			res.send("Your account deletion has failed.")
		}
	})
}
auth.register = function (req, res){
	auth.registerCredentials(req.body.username,req.body.passwd, function (success, msg){
		if(success) {
			res.send('Your registration was successful. Welcome!');
		} else {
			res.send('Your registration has failed. ' + msg + '<br/> Click <a href="/register">here</a> to try again');
		}
	})
}
auth.registerCredentials = function (username, passwd, callback){
	MongoClient.connect('mongodb://localhost/NodeWebsite', function (err, db) {
		if(err) {
			return console.dir(err);
		}
		var collection = db.collection('users');
		var document = collection.findOne({'username':username}, function(err, result){
			if(err) {
				return console.dir(err);		
			}
			if(result) {
				callback(false, 'That username already exists')
			} else {
				if(auth.securePassword(passwd)) {
					console.log(passwd)
					collection.insert({"username":username,"passwd":passwd}, function(err){
						callback(true);
					});
				} else {
					callback(false, 'That password is not secure enough')
				}
			}
		});
	})
}
auth.securePassword = function(passwd){
	if(passwd === null || passwd === '') {
		return false;
	}
	return true;
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