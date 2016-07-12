'use strict';

app.controller('LoginCtrl', function ($scope, LoginFactory, $state){

 $scope.submitLogin = function(){
  LoginFactory.loginAttempt($scope.email, $scope.password)
  .then(function(){
    console.log("it worked")
    $state.go("stories")
  }).catch(console.error)
 }

});
