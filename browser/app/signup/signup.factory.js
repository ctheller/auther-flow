'use strict';



app.factory('SignupFactory', function ($http, $log) {
  var SignupFactory = {};

  SignupFactory.signUp = function(userEmail, userPassword){

    return $http.post('/signup', {email: userEmail, password: userPassword})
    .catch($log.error);
  }


  return SignupFactory;
});
