'use strict';
angular.module('myApp.delivery_guy',['ngRoute','firebase'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/deliveryGuy', {
        templateUrl: 'user/delivery_guy/delivery_guy.html',
        controller: 'DeliveryGuy'
    });
}])


.controller('DeliveryGuy', ['$scope','$location','$firebase','LoginService', function($scope,$location,$firebase,LoginService){
	
    console.log(Constants.Status['pending']);
    
	//connection with firebase
	var firebaseObj = new Firebase("https://x-press-yeti.firebaseio.com/delivery_guy");
    var fb = $firebase(firebaseObj);


    //notification demo
    var newItems = false;
    var eventsList = new Firebase('ttps://x-press-yeti.firebaseio.com/delivery_request');
    eventsList.on('child_added', function(message) {
      if (!newItems) return;
      var message = message.val();
      console.log("message added is:", message.billNo);
      console.log("message added is:", message.amount);
      
    });
    eventsList.once('value', function(messages) {
      newItems = true;
    });


    $scope.applyForDeliveryGuy = function(){
	    var licenceNo = $scope.deliveryRequest.dirverLicenceNo;
	    var vehicleModel = $scope.deliveryRequest.vehicleModel;
	   

	    //storing data in firebase

	    fb.$push({
	    	licenceNo: licenceNo,
	    	vehicleModel: vehicleModel,
	    	 
	    }).then(function(ref){
        		console.log(ref);
        		$location.path('/home');
    		},function(error){
        		console.log("error: ");
        		console.log(error);
    		});
    };
}]);


