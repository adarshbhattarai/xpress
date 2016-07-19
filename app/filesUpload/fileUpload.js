'use strict';

angular.module('myApp.fileUpload', ['ngRoute','firebase'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/files', {
		templateUrl: 'filesUpload/fileUpload.html',
		controller: 'UploadCtrl'
	});
}])

.controller('UploadCtrl', ['$scope','$location','LoginService','$firebase', function($scope,$location,LoginService,$firebase) {

						 // Initialize Firebase
           var config = {
            apiKey: "AIzaSyAehjGXCTDFvPJ6XtGU02mzoBW2Ssove04",
            authDomain: "x-press-yeti.firebaseapp.com",
            databaseURL: "https://x-press-yeti.firebaseio.com",
            storageBucket: "x-press-yeti.appspot.com",
          };
          firebase.initializeApp(config);

          var uploader =  document.getElementById('uploader');
          var fileButton = document.getElementById('fileButton');
          console.log("Fuck eaasdasd");
          fileButton.addEventListener ('change', function(e){
                          //Get FIle
                          var file = e.target.files[0];

                          // Create  a storage ref
                          var storageRef = firebase.storage().ref('driver/' + file.name);
                          console.log(storageRef);


                          //upload File
                          var task = storageRef.put(file);

                          //Update Progress Bar
                          task.on('state_changed',

                            function progress(snapshot){

                              var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100 ;
                              uploader.value = percentage;
                              console.log(percentage);

                            },

                            function error(err){


                            },

                            function complete(){
                            console.log("completed");
                            $scope.downloadURL = task.snapshot.downloadURL;
                            console.log($scope.downloadURL);
                             });


                      });


}]);