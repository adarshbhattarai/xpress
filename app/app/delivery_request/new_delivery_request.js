'use strict';
angular.module('myApp.delivery_request',['ngRoute','firebase'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/deliveryRequest', {
        templateUrl: 'delivery_request/new_delivery_request.html',
        controller: 'DeliveryRequest'
    });
}])


.controller('DeliveryRequest', ['$scope','$location','$firebase','LoginService', function($scope,$location,$firebase,LoginService){
	
    // Only used for testing purpose need to delete later. added by Bikram Khyaju
    $scope.deliveryRequest = {
        billNo: 33333,
        fullName: "khyaju bikram",
        phone:1234567890,
        boxNum: 34,
        weight: 30,
        amount: 100,
        paidAmt:80,
        deliveryTime:3
    };

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
       var amount = $scope.deliveryRequest.amount;
       var amountPaid = $scope.deliveryRequest.paidAmt;
       var address = document.getElementById('pac-input').value;
       var estimatedDeliveryTime = $scope.deliveryRequest.deliveryTime;
       var remainingPayment = amount - amountPaid;
       var today = new Date().getTime();
       console.log(today);
       var user = LoginService.getUser(); 
       console.log(remainingPayment);

      //test for notification
       var status = "Requested";
       

       fb.$push({
        billNo:billNo,
        fullName:fullName,
        phone:phone,
        noOfBox:noOfBox,
        weightOfBox:weightOfBox,
        amount:amount,
        amountPaid:amountPaid,
        address:address,
        estimatedDeliveryTime:estimatedDeliveryTime,
        remainingPayment:remainingPayment,
        date:today,
        status:status,         
        user:user,
        '.priority':user

    }).then(function(ref){
        console.log(ref);
        $location.path('/home');
    },function(error){
        console.log("error: ");
        console.log(error);
    });

    };

    $scope.logout = function(){
        LoginService.logoutUser();
    };
    
}]);

