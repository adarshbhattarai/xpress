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
 //   if(customerList.length !=0){
    customerList.$loaded().then(function(array) {
    console.log(array[0]);
    var details  = array[0];
   /* console.log(details.profilePictureURL);*/
    console.log(customerList.length);
    if(customerList.length == '0'){
        $scope.profilePictureURL = 'https://firebasestorage.googleapis.com/v0/b/x-press-yeti.appspot.com/o/default_profile_image%2Fprofile-icon.png?alt=media&token=7275d15c-814e-4d82-95a4-de9d689e3a12';
              
    }else{ 
        $scope.profilePictureURL = details.profilePictureURL;
        console.log($scope.profilePictureURL);
    }
  	console.log($scope.profilePictureURL);
});
//}
/*else{
      $scope.profilePictureURL = 'https://firebasestorage.googleapis.com/v0/b/x-press-yeti.appspot.com/o/default_profile_image%2Fprofile-icon.png?alt=media&token=7275d15c-814e-4d82-95a4-de9d689e3a12';
    }*/

	$scope.logout = function(){
        console.log("header logout clicked");
	   delete sessionStorage.loggedIn;
      LoginService.logoutUser();
	}

}]);

