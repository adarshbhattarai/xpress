'use strict'

angular.module('myApp.addDetails', ['ngRoute','firebase'])
 
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/addDetails', {
        templateUrl: 'user/business_customer/addDetails.html',
        controller: 'CustomerDetailsCtrl'
    });
}])
.controller('CustomerDetailsCtrl', ['$scope','$location','$firebase','LoginService','$rootScope', function($scope,$location,$firebase,LoginService, $rootScope) {
    $scope.hideMenu = sessionStorage.sideMenu;
    console.log($scope.hideMenu);
    console.log("Session "+sessionStorage.sideMenu);
    
    var firebaseObj = new Firebase("https://x-press-yeti.firebaseio.com/user/business_customer");
    var fb = $firebase(firebaseObj);
    var authData= firebaseObj.getAuth();
    $scope.username= LoginService.getUser();
    $scope.customerList = fb.$asArray();
    
    $scope.addDetailsofCustomer = function(){
        var user = LoginService.getUser();
        var firstName = $scope.user.firstName;
        var lastName = $scope.user.lastName;
        var email = $scope.username;
        var phone = $scope.user.phone;
        var address = $scope.user.address;
        var city = $scope.user.city;
        var state = $scope.user.state;
        var zip = $scope.user.zip;
        var profilePic = $scope.profilePicURL;
        var role = 'USER';
        console.log("User role is: "+role);

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
            role:role,
            profilePictureURL:profilePic,
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

    /*Image uploading*/
        var uploaderpp =  document.getElementById('uploader');
          var fileButton = document.getElementById('fileButton');
         
          fileButton.addEventListener ('change', function(e){
                          //Get FIle
                          var file = e.target.files[0];

                          // Create  a storage ref
                          var storageRef = firebase.storage().ref('Customer_Profile_Picture/' + file.name);
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
                              
                            $scope.profilePicURL = task.snapshot.downloadURL;
  
                             });


                      });




    $scope.logout = function(){
        delete sessionStorage.loggedIn;
        LoginService.logoutUser();
    }
}]);