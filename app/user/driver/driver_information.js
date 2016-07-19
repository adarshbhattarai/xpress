'use strict'

angular.module('myApp.driverRegistration', ['ngRoute','firebase'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/driver-registration', {
        templateUrl: 'user/driver/driver_information.html',
        controller: 'AddDetailsCtrl'
    });
}])
.controller('AddDetailsCtrl', ['$scope','$location','$firebase','$window','LoginService', function($scope,$location,$firebase,$window,LoginService) {
    $scope.sideMenu = sessionStorage.sideMenu;   
    $scope.username = LoginService.getUser();
      
       if(!$scope.username){
          $location.path('/login');
      }

    var firebaseObj = new Firebase("https://x-press-yeti.firebaseio.com/user/driver");
    var fb = $firebase(firebaseObj);
    var latitude;
    var longitude;

    /* var config = {
            apiKey: "AIzaSyAehjGXCTDFvPJ6XtGU02mzoBW2Ssove04",
            authDomain: "x-press-yeti.firebaseapp.com",
            databaseURL: "https://x-press-yeti.firebaseio.com",
            storageBucket: "x-press-yeti.appspot.com",
          };
          firebase.initializeApp(config);*/

          var uploaderpp =  document.getElementById('uploader.profilepicture');
          var fileButton = document.getElementById('exampleInputFile');
          var uploadInsDocsProgress = document.getElementById('insuranceuploader');
          var insuranceDocButton = document.getElementById('insDocumentButton');
          fileButton.addEventListener ('change', function(e){
                          //Get FIle
                          var file = e.target.files[0];

                          // Create  a storage ref
                          var storageRef = firebase.storage().ref('Driver_Profile_Picture/' + file.name);
                          console.log(storageRef);


                          //upload File
                          var task = storageRef.put(file);

                          //Update Progress Bar
                          task.on('state_changed',

                            function progress(snapshot){

                              var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100 ;
                              uploaderpp.value = percentage;
                              console.log(percentage);

                            },

                            function error(err){

                                // Do something iferror occurs
                            },

                            function complete(){
                              
                            $scope.downloadURLpp = task.snapshot.downloadURL;
  
                             });


                      });
          insuranceDocButton.addEventListener('change', function(e){

                    var file = e.target.files[0];

                          var storageRef = firebase.storage().ref('Driver_InsuranceDocuments/' + file.name);
                          console.log(storageRef);
                          var uploadTask = storageRef.put(file);
                          uploadTask.on('state_changed',

                            function progress(snapshot){

                              var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100 ;
                              uploadInsDocsProgress.value = percentage;
                              console.log(percentage);

                            },

                            function error(err){

                                // Do something iferror occurs
                            },

                            function complete(){
                              
                            $scope.downloadURLInsuranceDocs = uploadTask.snapshot.downloadURL;
  
                             });
          });



     $scope.addressMapping = function(address){
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode( { 'address': address}, function(results, status) {

          if (status == google.maps.GeocoderStatus.OK) {
             latitude = results[0].geometry.location.lat();
             longitude = results[0].geometry.location.lng();
            
        }       
        console.log(latitude);
        console.log("latLong");
       $scope.firebasepush();
    }); 
    }

    $scope.addDetails = function(){
       
        var address = $scope.details.address;
        $scope.addressMapping(address);
       
    }

    $scope.firebasepush = function(){

        var status = "PENDING";
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
        var requestdDate = new Date().getTime();
        console.log(requestdDate);
        console.log("requestdDate for driver");

         fb.$push({
            firstName:firstName,
            lastName:lastName,
            email:email,
            phone:phone,
            address: address,
            city: city,
            state: state,
            zip:zip,
            dlNO: DlNo,
            expiryDate: expiryDate,
            vehicleNo: vehicleNo,
            model: model,
            color: color,
            latitude: latitude,
            longitude: longitude,
            status: status,
            profilepicture :$scope.downloadURLpp,
            insuranceDoc : $scope.downloadURLInsuranceDocs,
            date:requestdDate

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
