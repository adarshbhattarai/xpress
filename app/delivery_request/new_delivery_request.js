  'use strict';
  angular.module('myApp.delivery_request',['ngRoute','firebase'])

  .config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/deliveryRequest', {
    templateUrl: 'delivery_request/new_delivery_request.html',
    controller: 'DeliveryRequest'
  });
  }])


  .controller('DeliveryRequest', ['$scope','$location','$firebase','LoginService', function($scope,$location,$firebase,LoginService){
  $scope.sideMenu = sessionStorage.sideMenu;
  $scope.username = LoginService.getUser();

  if(!$scope.username){
    $location.path('/login');
  }

  var firebaseObj = new Firebase("https://x-press-yeti.firebaseio.com/delivery_request");
  var fb = $firebase(firebaseObj);
    
  /*$scope.deliveryRequest.boxNum = 0;
  $scope.arr = [];
  $scope.makeList = function(){
  $scope.arr.length = 0;
  for (var i = 0; i < parseInt($scope.deliveryRequest.boxNum) ; i++) {
  $scope.arr.push(i);
    }
  }*/

  $scope.cancelRequestForm = function(){
  // console.log("cancel form");
    $scope.deliveryRequest = {};
    //$scope.deliveryRequest.amount = 0;
    //$location.path('/deliveryRequest');
  };

  $scope.addDeliveryRequest = function(){
    var pacAddress = document.getElementById('pac-input').value;
    var desAddress = document.getElementById('destination').value;
    var pLatitude;
    var pLongitude;
    var dLatitude;
    var dLongitude;
    if(pacAddress != null && desAddress != null){
        $scope.pAddress = pacAddress;
        $scope.desAddress = desAddress;
        $scope.latLon();
        pLatitude = $scope.packageLatitude;
        pLongitude = $scope.packageLongitude;
        dLatitude = $scope.destinationLatitude;
        dLongitude = $scope.destinationLongitude;
      }
    else {
       pLatitude=0;
       pLongitude=0;
       dLatitude=0;
       dLongitude=0;
    }
   };

/*For payment*/
    $.getScript( "https://js.braintreegateway.com/v2/braintree.js", function() {
      console.log("Second Error");
      $.ajax({
        url: '/deliveryRequest',
        type: "GET",
        crossDomain: true,
        //dataType : 'json',
        success: function(clientToken){
          //alert('Ahhh:'+clientToken.token);
        /*  console.log(clientToken.token);*/
         var token = clientToken.token;
         braintree.setup(token, "dropin", {
          container: "payment-form"
        });
       },
       error: function(xhr, ajaxOptions, thrownError) {
       /* alert(xhr.status);
        alert(thrownError);*/
      }
    });
    });

    $scope.latLon = function (){
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode( { 'address': $scope.pAddress}, function(results, status) {

        if (status == google.maps.GeocoderStatus.OK) {
          var latitude = results[0].geometry.location.lat();
          var longitude = results[0].geometry.location.lng();
          $scope.packageLatitude = latitude;
          $scope.packageLongitude = longitude;
          console.log("longitude");
          console.log($scope.packageLongitude);

    geocoder.geocode( { 'address': $scope.desAddress}, function(results, status) {

        if (status == google.maps.GeocoderStatus.OK) {
          var latitude = results[0].geometry.location.lat();
          var longitude = results[0].geometry.location.lng();
          $scope.destinationLatitude = latitude;
          $scope.destinationLongitude = longitude;

          $scope.pushToDatabase();
        } 
      });
        } 
      });
     
    }


    /*for  image uploading*/
   

  /*   var config = {

            apiKey: "AIzaSyAehjGXCTDFvPJ6XtGU02mzoBW2Ssove04",
            authDomain: "x-press-yeti.firebaseapp.com",
            databaseURL: "https://x-press-yeti.firebaseio.com",
            storageBucket: "x-press-yeti.appspot.com",
          };
          firebase.initializeApp(config);*/

          var uploader =  document.getElementById('uploader');
          var fileButton = document.getElementById('fileButton');
          var progressbar = document.getElementById('progressbar');
          var pictures = document.getElementById('pictures');
          fileButton.addEventListener ('change', function(e){
                          //Get FIle
                          var file = e.target.files[0];

                          // Create  a storage ref
                          var storageRef = firebase.storage().ref('deliveryRequest/' + file.name);
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

                                // Do something iferror occurs
                            },

                            function complete(){

                            $scope.downloadURL = task.snapshot.downloadURL;
  
                             });


                      });
          pictures.addEventListener('change', function(e){

               //Get FIle
                          var file = e.target.files[0];

                          // Create  a storage ref
                          var storageRef = firebase.storage().ref('deliveryRequest/packages/' + file.name);
                          console.log(storageRef);


                          //upload File
                          var task = storageRef.put(file);

                          //Update Progress Bar
                          task.on('state_changed',

                            function progress(snapshot){

                              var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100 ;
                              progressbar.value = percentage;
                              console.log(percentage);

                            },

                            function error(err){

                                // Do something iferror occurs
                            },

                            function complete(){

                            $scope.package.picture = task.snapshot.downloadURL;
  
                             });


          });


    $scope.pushToDatabase = function(){
      console.log("packageList");
      console.log($scope.packageList);
      var packageInfo = $scope.packageList;
      // var billNo = $scope.deliveryRequest.billNo;
      var fullName = $scope.deliveryRequest.fullName;
      var phone = $scope.deliveryRequest.phone;
      // var noOfBox = $scope.deliveryRequest.boxNum;
      // var weightOfBox = $scope.deliveryRequest.weight;
      $scope.deliveryRequest.amount = 15;
      /*       var amount = $scope.deliveryRequest.amount;
      var amountPaid = $scope.deliveryRequest.paidAmt;*/
      var pacAddress = document.getElementById('pac-input').value;
      var desAddress = document.getElementById('destination').value;
      var estimatedDeliveryTime = $scope.deliveryRequest.deliveryTime;
      /*var remainingPayment = amount - amountPaid;*/
      var today = new Date().getTime();
      console.log(today);
      var user = LoginService.getUser(); 
      var status = "Requested";
      var vehicleType = $scope.deliveryRequest.vehicleType;
     /* var images = $scope.files;
      var imageData=$base64.encode(images);
      console.log("image string: "+imageData);*/

      //pushing values in firebase database


      fb.$push({
        fullName:fullName,
        phone:phone,
        address:pacAddress,
        packageLatitude:$scope.packageLatitude,
        packageLongitude:$scope.packageLongitude,
        destinationLatitude:$scope.destinationLatitude,
        destinationLongitude:$scope.destinationLongitude,
        estimatedDeliveryTime:estimatedDeliveryTime,
        destinationAddress: desAddress,
        /*remainingPayment:remainingPayment,*/
        date:today,
        status:status,         
        user:user,
        packageInfo : packageInfo,
        vehicleType: vehicleType,
        picture:$scope.downloadURL,

        '.priority':user

      }).then(function(ref){

        console.log(ref);
        alert("Thank you for requesting a ride!!Please proceed with the payment: "+$scope.packageLatitude);
        console.log("Thank you for requesting a ride!!Please proceed with the payment:");
        console.log($scope.downloadURL);
        $scope.paymentform =true;
        console.log(ref.path.u[1]);
        console.log(typeof(ref));

        // this gives the Id where the above data was pushed
        $scope.referenceId = ref.path.u[1];

      },function(error){
        console.log("error: ");
        console.log(error);
      });
    }

    /*$scope.firebasePush= function(){

       console.log("longitude");
        console.log($scope.destinationLongitude);
      }*/

      /*popup window*/
      $scope.packageList = [];
      $scope.packageDetails = false;
      $scope.packageDescription = function(){
        $scope.packageDetails = true;
        console.log("package info submitted");
        console.log($scope.package);
        var packageItem = $scope.package
        console.log("packageItem");
        console.log(packageItem);
        $scope.packageList.push(packageItem);
        console.log($scope.packageList);
        $scope.package='';
       /* console.log($scope.packageList);*/
        /*console.log("Weight here" + $scope.packageList[0].weight)*/
      };

        // remove an item
    $scope.remove = function(index) {
      console.log("remove "+index);
      $scope.packageList.splice(index, 1);
    };

      $scope.logout = function(){
        delete sessionStorage.loggedIn;
        LoginService.logoutUser();
      };
      //uploading image


    }]);

