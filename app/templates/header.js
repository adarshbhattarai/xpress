'use strict';
angular.module('myApp.header', ['ngRoute','firebase'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/#', {
        templateUrl: 'templates/header.html',
        controller: 'DeliveryRequest'
    });
}])




.controller('headerCtrl', ['$scope','$location','LoginService','$firebase', function($scope,$location,LoginService,$firebase) {
	$scope.username = LoginService.getUser();
	if(!$scope.username){
		$location.path('/login');
	}

	$scope.logout = function(){
	    delete sessionStorage.loggedIn;
      LoginService.logoutUser();
	}

}]);

