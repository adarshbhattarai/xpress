'use strict'

angular.module('myApp.cust_request', ['ngRoute','firebase'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/cust_request', {
		templateUrl: 'user_request/request.html',
		controller: 'AddRequestCtrl'
	});
}])

.controller('AddRequestCtrl', ['$scope','$location','$firebase','LoginService', function($scope,$location,$firebase,LoginService) {
	console.log("Printed");
//Reference to the firebase
var firebaseObj = new Firebase("https://x-press-yeti.firebaseio.com/user_request");
var fb = $firebase(firebaseObj);

var firebaseNotify = new Firebase("https://x-press-yeti.firebaseio.com/deliveryguy_notification");


$scope.request = function(){

			//Registering DOM Elements and Field values
			var requestField ="Requested";
			var nameField = $scope.request.nameInput;
			var messageList = $('#response-message');
				//Save Data to firebase and empty Field
				fb.$push({customername:nameField, request:requestField});
				/*requestField.val('');*/
				console.log("Pushed Value");




			}

		firebaseNotify.limitToLast(1).on('child_added', function(snapshot){
		var data = snapshot.val();
		var customername = data.customername;
		var driver_response = data.driver_response;
		var drivername = data.drivername;
		$scope.customername = customername;
		$scope.driver_response = driver_response;
		$scope.drivername = drivername;

		var messageList = $('#response-message');
		var messageElement = $("<li>");
		var nameElement = $("<strong class='example-notification'></strong>");
		nameElement.text(drivername);
		messageElement.text(driver_response).prepend(nameElement);
		messageList.append(messageElement)

	});



}]);
