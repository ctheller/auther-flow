'use strict';

var currentUser = null;

app.factory('AuthFactory', function ($http, $log) {
  var AuthFactory = {};

  AuthFactory.loginAttempt = function(userEmail, userPassword){
    return $http.post('/login', {email: userEmail, password: userPassword})
    .then(function(response){
    	currentUser = response.data;
    })
    .catch($log.error);
  }

  AuthFactory.logOut = function(){
  	currentUser = null;
  	return $http.get('/logout')
  }

  AuthFactory.signUp = function(userEmail, userPassword){
    return $http.post('/signup', {email: userEmail, password: userPassword})
    .then(function(response){
    	currentUser = response.data;
    })
    .catch($log.error);
  }

  AuthFactory.getCurrentUser = function(){
  	return currentUser;
  }

  AuthFactory.getMe = function(){
    return $http.get('/auth/me')
    .then(function(resp){
      currentUser = resp.data;
    }).catch($log.error);
  }

  return AuthFactory;
});