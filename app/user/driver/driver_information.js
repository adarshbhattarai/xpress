'use strict'

angular.module('myApp.driverInfo', ['ngRoute','firebase'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/driver-information', {
        templateUrl: 'user/driver/driver_information.html',
        controller: 'AddDetailsCtrl'
    });
}])
.controller('AddDetailsCtrl', ['$scope','$location','$firebase','LoginService', function($scope,$location,$firebase,LoginService) {
       
    $scope.username = LoginService.getUser();
      
       if(!$scope.username){
          $location.path('/login');
      }

    var firebaseObj = new Firebase("https://x-press-yeti.firebaseio.com/user/driver");
    var fb = $firebase(firebaseObj);
    var latitude;
    var longitude;
    /*var authData = firebaseObj.getAuth();  
    console.log("the auth id is: "+authData.uid);*/

     $scope.addressMapping = function(address){
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode( { 'address': address}, function(results, status) {

          if (status == google.maps.GeocoderStatus.OK) {
             latitude = results[0].geometry.location.lat();
             longitude = results[0].geometry.location.lng();
            
           
            console.log("Happy bthday to you" + latitude);
        } 

       
        console.log(latitude);
       
        console.log("latLong")
    }); 
    }

    $scope.addDetails = function(){
        var firstName = $scope.details.firstName;
        var middleName = $scope.details.middleName
        var lastName = $scope.details.lastName;
        var email = $scope.details.email;
        var phone = $scope.details.phone;
        var address = $scope.details.address;
        var city = $scope.details.city;
        var state = $scope.details.state;
        var zip = $scope.details.zip;
        var profilePhoto = $scope.details.files;
        var DlNo = $scope.details.dlNO;
        var expiryDate = $scope.details.expiryDate;
        var vehicleNo = $scope.details.vehicleNo;
        var model = $scope.details.model;
        var color = $scope.details.color;
        var insuranceDoc = $scope.details.insuranceDoc;
        $scope.addressMapping(address);
       console.log(latitude);
        fb.$push({
            firstName:firstName,
            lastName:lastName,
            email:email,
            phone:phone,
            address: address,
            city: city,
            state: state,
            zip:zip,
            /*profilePhoto: profilePhoto,*/
            dlNO: DlNo,
            expiryDate: expiryDate,
            vehicleNo: vehicleNo,
            model: model,
            color: color,
            latitude: latitude,
            longitude: longitude

        }).then(function(ref){
            console.log(ref); 
            console.log("Saved Successfully");
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

