'use strict'; 

var app = require('express')();
var path = require('path');

app.use(require('./logging.middleware'));

app.use(require('./request-state.middleware'));

var session = require('express-session');
var User = require('../api/users/user.model');

app.use(session({
  // this mandatory configuration ensures that session IDs are not predictable
  secret: 'tongiscool',
  duration: 30*60*1000,
  activeDuration: 5*60*1000
}));

app.use(function (req, res, next) {
  console.log('session', req.session);
  next();
});

app.post('/login', function(req, res, next){
	User.findOne({where: req.body })
	.then(function(user){
		if (!user) return res.sendStatus(401);
		req.session.userId = user.id;
		res.sendStatus(204);
	})
	.catch(next);
});

app.use('/api', require('../api/api.router'));

app.use(require('./statics.middleware'));

var validFrontendRoutes = ['/', '/stories', '/users', '/stories/:id', '/users/:id', '/signup', '/login'];
var indexPath = path.join(__dirname, '..', '..', 'public', 'index.html');
validFrontendRoutes.forEach(function (stateRoute) {
  app.get(stateRoute, function (req, res) {
    res.sendFile(indexPath);
  });
});

app.use(require('./error.middleware'));

module.exports = app;
