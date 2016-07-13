'use strict';

app.controller('LoginCtrl', function ($scope, AuthFactory, $state){

 $scope.submitLogin = function(){
  AuthFactory.loginAttempt($scope.email, $scope.password)
  .then(function(user){
    $state.go("user", {id: AuthFactory.getCurrentUser().id})
  }).catch(console.error)
 }

});
