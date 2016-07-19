'use strict'

angular.module('myApp.dvguy_response', ['ngRoute','firebase'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/driver_response', {
		templateUrl: 'dvguy_response/response.html',
		controller: 'AddResponseCtrl'
	});
}])


.controller('AddResponseCtrl', ['$scope','$location','$firebase','LoginService', function($scope,$location,$firebase,LoginService) {
	console.log("Printed");

	var firebaseObj = new Firebase("https://x-press-yeti.firebaseio.com/user_request");
	
	var firebaseNotify = new Firebase("https://x-press-yeti.firebaseio.com/deliveryguy_notification");
	var fbdelivery = $firebase(firebaseNotify);
	
	var username;
	firebaseObj.limitToLast(1).on('child_added', function(snapshot){
		var data = snapshot.val();
		username = data.customername;
		var request = data.request;
		$scope.username = username;

		var messageList = $('#response-message');
		var messageElement = $("<li>");
		var nameElement = $("<strong class='example-notification'></strong>");
		nameElement.text(username);
		messageElement.text(request).prepend(nameElement);
		messageList.append(messageElement)
	});


	$scope.accept = function(){

			//Registering DOM Elements and Field values
			var acceptedField ="Accepted";
			var nameField = $scope.response.nameInput;
			console.log('Accepted Request by ' + nameField);
			fbdelivery.$push({drivername:nameField, customername:username ,driver_response:acceptedField});
			
		}

		$scope.reject = function(){

			var rejectedField = "Rejected";
			var nameField = $scope.response.nameInput;
			console.log('Rejected Request by ' + nameField);
			fbdelivery.$push({drivername:nameField, customername:username, driver_response: rejectedField});

		}

	}]);
