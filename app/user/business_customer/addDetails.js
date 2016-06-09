'use strict'

angular.module('myApp.addDetails', ['ngRoute','firebase'])
 
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/addDetails', {
        templateUrl: 'user/business_customer/addDetails.html',
        controller: 'CustomerDetailsCtrl'
    });
}])
.controller('CustomerDetailsCtrl', ['$scope','$location','$firebase','LoginService', function($scope,$location,$firebase,LoginService) {
    var firebaseObj = new Firebase("https://x-press-yeti.firebaseio.com/user/business_customer");
    var fb = $firebase(firebaseObj);
    var authData= firebaseObj.getAuth();

    $scope.addDetailsofCustomer = function(){
        var user = LoginService.getUser();
        var firstName = $scope.details.firstName;
        var lastName = $scope.details.lastName;
        var email = $scope.details.email;
        var phone = $scope.details.phone;
        var address = $scope.details.address;
        var city = $scope.details.city;
        var state = $scope.details.state;
        var zip = $scope.details.zip;

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
           
        }).then(function(ref){
            console.log(ref); 
            console.log("Saved Successfully");
            console.log(firstName);
            console.log(user);
           $location.path('/home');       
        },function(error){
            console.log("error: ");
            console.log(error);
        });
    }

    $scope.logout = function(){
        delete sessionStorage.loggedIn;
        LoginService.logoutUser();
    }
}]);