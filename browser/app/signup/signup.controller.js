'use strict';

app.controller('SignupCtrl', function ($scope, SignupFactory, $state){

 $scope.makeAccount = function(){
  SignupFactory.signUp($scope.email, $scope.password)
  .then(function(){
    console.log("it worked")
    $scope.email = "";
    $scope.password = "";
    $state.go("stories")
  }).catch(console.error)
 }

});