'use strict';
function initAutocomplete() {
    var input = document.getElementById('address');
    searchBox = new google.maps.places.Autocomplete(input);
}

angular.module('myApp.settings', ['ngRoute','firebase'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/settings', {
		templateUrl: 'settings/settings.html',
		controller: 'SettingsCtrl'
	});
}])


.filter('tel', function () {
    return function (tel) {
        console.log(tel);
        if (!tel) { return ''; }

        var value = tel.toString().trim().replace(/^\+/, '');

        if (value.match(/[^0-9]/)) {
            return tel;
        }

        var country, city, number;

        switch (value.length) {
            case 1:
            case 2:
            case 3:
                city = value;
                break;

            default:
                city = value.slice(0, 3);
                number = value.slice(3);
        }

        if(number){
            if(number.length>3){
                number = number.slice(0, 3) + '-' + number.slice(3,7);
            }
            else{
                number = number;
            }

            return ("(" + city + ") " + number).trim();
        }
        else{
            return "(" + city;
        }

    };
})

.controller('SettingsCtrl', ['$scope','$location','LoginService','$firebase', function($scope,$location,LoginService,$firebase) {
	$scope.username = LoginService.getUser();
    $scope.sideMenu = sessionStorage.sideMenu;
    
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
    $scope.email = details.email;
    $scope.address = details.address;
    $scope.city = details.city;
    $scope.state = details.state;
    $scope.zip = details.zip;
    /*console.log( $scope.firstName);
    console.log(details.firstName);*/
});
  console.log("This "+$scope.requests);



$scope.update = function(request){


    if(request === undefined) {
    console.log("Id is in if condittion"+$scope.id);

    $scope.editForm = true ;
 }


   
 if(navigator.geolocation)
        navigator.geolocation.getCurrentPosition(success,fail);
        else
    alert("Please allow your location");
    
    function success(position){
    var googleLatalng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    console.log("latitude");
    $scope.latitude = position.coords.latitude;
    $scope.longitude = position.coords.longitude;
    console.log(position.coords.latitude);
   /* $("p").html("Latitude: "+ position.coords.latitude + "<br>Longitude: "+ position.coords.longitude +
                "<br>Accuracy: "+ position.coords.accuracy);*/
            }

function fail(error){
    var errorType = {
        0: "Unknown Error",
        1: "Permission Denied by the user",
        2: "Position of the user not available",
        3: "Request time out"
    };
    var errMsg = errorType[error.code];
    if(error.code == 0 || error.code == 2){
        errMsg = errMsg + " " + error.message;
    }
    $("p").html(errMsg);
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
     var email = $scope.username;
     var address = $scope.address;
     var phone = $scope.phone;
     var city = $scope.city;
     var state = $scope.state;
     var zip = $scope.zip;
     var profilePicURL = $scope.profilePicURL;
     console.log()
     /*var role = 'USER';
     console.log("User role is: "+role);*/
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
         current_latitude:$scope.latitude,
         current_longitude:$scope.longitude,
         profilePicURL:profilePicURL,

        /* role:role,*/
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
        records.email = $scope.username;
        records.phone = $scope.phone;
        records.address = $scope.address;
        records.city = $scope.city;
        records.state = $scope.state;
        records.zip = $scope.zip;
        records.current_longitude = $scope.longitude;
        records.current_latitude = $scope.latitude;
        records.profilePictureURL = $scope.profilePicURL;
        $scope.requests.$save(records);
        $scope.editForm = false ;
        console.log("records.firstName " + records.firstName); 
        console.log("latitude-->" + $scope.latitude);
        console.log("welllll..."+records.profilePictureURL);

    }
    
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
   LoginService.logoutUser();
}
}]);

