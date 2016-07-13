'use strict';

app.controller('LoginCtrl', function ($scope, AuthFactory, $state){

 $scope.submitLogin = function(){
  AuthFactory.loginAttempt($scope.email, $scope.password)
  .then(function(){
    $state.go("stories")
  }).catch(console.error)
 }

});
