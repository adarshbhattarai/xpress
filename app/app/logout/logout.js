'use strict';

angular.module('myApp.logout', ['ngRoute','firebase'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/logout', {
		templateUrl: 'login/login.html',
		controller: 'logoutCtrl'
	});
}])

.controller('logoutCtrl', ['$scope','$location','LoginService','$firebase', function($scope,$location,LoginService,$firebase) {
		
		$scope.logout = function(){
		console.log("Reached ");
		LoginService.logoutUser();
		$location.path('/login');
	}
}]);
