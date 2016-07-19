'use strict';

angular.module('myApp.settings', ['ngRoute','firebase'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/settings', {
		templateUrl: 'settings/settings.html',
		controller: 'SettingsCtrl'
	});
}])

.controller('SettingsCtrl', ['$scope','$location','LoginService','$firebase', function($scope,$location,LoginService,$firebase) {
	$scope.username = LoginService.getUser();
   // $scope.editFormShow = false;
   console.log(" Reached here");
   if(!$scope.username){
      $location.path('/login');
  }


  var firebaseObj = new Firebase("https://x-press-yeti.firebaseio.com/user/business_customer");
  var fb =  $firebase(firebaseObj);
  var sync = $firebase(firebaseObj.startAt($scope.username).endAt($scope.username));
  $scope.requests = sync.$asArray();
  var test = sync.$asArray();
  test.$loaded().then(function(array) {
    console.log(array[0]);
    var details = $scope.profile = array[0];
    $scope.firstName = details.firstName;
    $scope.lastName = details.lastName;
    $scope.phone = details.phone;
    $scope.address = details.address;
    $scope.city = details.city;
    $scope.state = details.state;
    $scope.zip = details.zip;
    /*console.log( $scope.firstName);
    console.log(details.firstName);*/
});
  console.log("This "+$scope.requests);



  $scope.update = function(request){


    if(request == null) {
console.log("Id is in if condittion"+$scope.id);

$scope.editForm = true ;
 }

 $scope.editForm = true ;
 $scope.firstName = request.firstName;
 $scope.lastName = request.lastName;
 $scope.email = request.email;
 $scope.phone = request.phone;
 $scope.address = request.address;
 $scope.city = request.city;
 $scope.state = request.state;
 $scope.zip = request.zip;
 $scope.id = request.$id;
 console.log("Id is "+$scope.id);


}

$scope.deletePost = function(request){

    $scope.requests.$remove(request);
}

$scope.editFormSubmit = function(){


    if($scope.id ===undefined || $scope.id === null) {
        console.log("PUSH");
     var user = LoginService.getUser();
     var firstName = $scope.firstName;
     var lastName =  $scope.lastName;
     var email = $scope.email;
     var address = $scope.address;
     var phone = $scope.phone;
     var city = $scope.city;
     var state = $scope.state;
     var zip = $scope.zip;
     console.log(city + "  " + " State" + state);
     fb.$push({
         firstName:firstName,
         lastName:lastName,
         email:email,
         phone:phone,
         address: address,
         city: city,
         state: state,
         zip:zip,
         emailId:user,
         '.priority':user

     });
    /* $scope.id =  test.$loaded().then(function(array) {
    console.log(array[0]);
    array[0];
    
});*/
     console.log("Array 0 value .. Scope id value " + $scope.id);
      console.log("user " + user );
      $location.path('/home');
 }

    else{
        console.log("UPDATE");
        console.log("Outside Scope");
        console.log("here");
        var id = $scope.id;
        console.log(id);
        var records = $scope.requests.$getRecord(id);
        records.firstName = $scope.firstName;
        records.lastName = $scope.lastName;
        records.email = $scope.email;
        records.phone = $scope.phone;
        records.address = $scope.address;
        records.city = $scope.city;
        records.state = $scope.state;
        records.zip = $scope.zip;
        $scope.requests.$save(records);
        $scope.editForm = false ;
        console.log("records.firstName " + records.firstName); 

    }
    
}

$scope.logout = function(){
   LoginService.logoutUser();
}
}]);