'use strict';

var app = angular.module('auther', ['ui.router']);

app.config(function ($urlRouterProvider, $locationProvider) {
  $locationProvider.html5Mode(true);

  $urlRouterProvider.when('/auth/:provider', function () {
  	window.location.reload();
  });

  $urlRouterProvider.otherwise('/');

});

app.controller('GetMeCtrl', function(AuthFactory){
	AuthFactory.getMe();
})
