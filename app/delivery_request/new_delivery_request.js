  'use strict';
  angular.module('myApp.delivery_request',['ngRoute','firebase'])

  .config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/deliveryRequest', {
    templateUrl: 'delivery_request/new_delivery_request.html',
    controller: 'DeliveryRequest'
  });
  }])


  .controller('DeliveryRequest', ['$scope','$location','$firebase','LoginService', function($scope,$location,$firebase,LoginService){

$scope.username = LoginService.getUser();

if(!$scope.username){
  $location.path('/login');
}


 /* // Only used for testing purpose need to delete later. added by Bikram Khyaju
  $scope.deliveryRequest = {
      billNo: 33333,
      fullName: "khyaju bikram",
      phone:1234567890,
      boxNum: 34,
      weight: 30,
      amount: 100,
      paidAmt:80,
      deliveryTime:3
    };*/

    var firebaseObj = new Firebase("https://x-press-yeti.firebaseio.com/delivery_request");
    var fb = $firebase(firebaseObj);

    $scope.cancelRequestForm = function(){
             // console.log("cancel form");
             $scope.deliveryRequest = {};
              //$scope.deliveryRequest.amount = 0;
              //$location.path('/deliveryRequest');

            };

            $scope.addDeliveryRequest = function(){
             var billNo = $scope.deliveryRequest.billNo;
             var fullName = $scope.deliveryRequest.fullName;
             var phone = $scope.deliveryRequest.phone;
             var noOfBox = $scope.deliveryRequest.boxNum;
                           var weightOfBox = $scope.deliveryRequest.weight;
              /*       var amount = $scope.deliveryRequest.amount;
              var amountPaid = $scope.deliveryRequest.paidAmt;*/
              var pacAddress = document.getElementById('pac-input').value;
              var desAddress = document.getElementById('destination').value;

              var estimatedDeliveryTime = $scope.deliveryRequest.deliveryTime;
              /*var remainingPayment = amount - amountPaid;*/
              var today = new Date().getTime();
              console.log(today);
              var user = LoginService.getUser(); 
              /*console.log(remainingPayment);*/


      //test for notification
      var status = "Requested";
      var pLatitude;
      var pLongitude;
      var dLatitude;
      var dLongitude;
      if(pacAddress != null && desAddress != null){
        $scope.pAddress = pacAddress;
        $scope.desAddress = desAddress;
        $scope.latLon();

        var pLatitude = $scope.packageLatitude;
        var pLongitude = $scope.packageLongitude;
        var dLatitude = $scope.destinationLatitude;
        var dLongitude = $scope.destinationLongitude;

      }

      else {
        var pLatitude=0;
        var pLongitude=0;
        var dLatitude=0;
        var dLongitude=0;
      }
      

      fb.$push({
        billNo:billNo,
        fullName:fullName,
        phone:phone,
        noOfBox:noOfBox,
        weightOfBox:weightOfBox,
        address:pacAddress,
        packageLongitude:pLongitude,
        packageLatitude:pLatitude,
        destinationLongitude:dLongitude,
        destinationLatitude:dLatitude,
        estimatedDeliveryTime:estimatedDeliveryTime,
        /*remainingPayment:remainingPayment,*/
        date:today,
        status:status,         
        user:user,
        '.priority':user

      }).then(function(ref){
        console.log(ref);
        alert("Thank you for requesting a ride!! Your Driver will soon notify you");
        $location.path('/home');
      },function(error){
        console.log("error: ");
        console.log(error);
      });

    };

    $scope.successOrErrorMessage = '';
    $scope.location = $location;
    $scope.$watch('location.search()', function() {
      $scope.successOrErrorMessage = ($location.search()).msg;
    }, true);


    $.getScript( "https://js.braintreegateway.com/v2/braintree.js", function() {

      console.log("Second Error");

      $.ajax({
        url: '/deliveryRequest',
        type: "GET",
        crossDomain: true,
        //dataType : 'json',
        success: function(clientToken){
         // alert('Ahhh:'+clientToken.token);
         var token = clientToken.token;
         braintree.setup(token, "dropin", {
          container: "payment-form"
        });
       },
       error: function(xhr, ajaxOptions, thrownError) {
        alert(xhr.status);
        alert(thrownError);
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
          console.log($scope.packageLatitude);
        } 
      });
      geocoder.geocode( { 'address': $scope.desAddress}, function(results, status) {

        if (status == google.maps.GeocoderStatus.OK) {
          var latitude = results[0].geometry.location.lat();
          var longitude = results[0].geometry.location.lng();
          $scope.destinationLatitude = latitude;
          $scope.destinationLongitude = longitude;

        } 
      });


    }

    /*$scope.firebasePush= function(){

       console.log("longitude");
        console.log($scope.destinationLongitude);
      }*/

      $scope.logout = function(){
        delete sessionStorage.loggedIn;
        LoginService.logoutUser();
      };

    }]);

