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

    var firebaseObj = new Firebase("https://x-press-yeti.firebaseio.com/user/business_customer");
    var sync = $firebase(firebaseObj.startAt($scope.username).endAt($scope.username));
    var customerList = sync.$asArray();
    customerList.$loaded().then(function(array) {
    console.log(array[0]);
    var details  = array[0];
    $scope.profilePictureURL = details.profilePictureURL;
  	console.log($scope.profilePictureURL);
    /*console.log( $scope.firstName);
    console.log(details.firstName);*/
});


	$scope.logout = function(){
	    delete sessionStorage.loggedIn;
      LoginService.logoutUser();
	}

}]);

