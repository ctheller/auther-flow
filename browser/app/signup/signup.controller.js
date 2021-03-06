'use strict';

app.controller('SignupCtrl', function ($scope, AuthFactory, $state){

 $scope.makeAccount = function(){
  AuthFactory.signUp($scope.email, $scope.password)
  .then(function(){
    console.log("Signed up")
    $scope.email = "";
    $scope.password = "";
    $state.go("user", {id: AuthFactory.getCurrentUser().id})
  }).catch(console.error)
 }

});