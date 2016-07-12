'use strict';



app.factory('LoginFactory', function ($http, $log) {
  var LoginFactory = {};

  LoginFactory.loginAttempt = function(userEmail, userPassword){

    return $http.post('/login', {email: userEmail, password: userPassword})
    .catch($log.error);
  }

  LoginFactory.logOut = function(){
  	return $http.get('/logout')
  }


  return LoginFactory;
});