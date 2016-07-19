'use strict';

angular.module('myApp.login', ['ngRoute','firebase'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'login/login.html',
    controller: 'LoginCtrl'
  });
}])

.controller('LoginCtrl', ['$scope','$location','LoginService','$firebaseAuth',function($scope,$location,LoginService,$firebaseAuth) {
	var login = {};
	$scope.login = login;

	var firebaseObj = new Firebase("https://x-press-yeti.firebaseio.com");
	var loginObj = $firebaseAuth(firebaseObj);

	/*loginObj.$onAuth(function(authData) {
	    if(authData){
	        LoginService.setUser(authData.password.email);
	        $location.path('/welcome');
	    }
 	});*/


	$scope.SignIn = function(event){
		
		login.loading = true;

		event.preventDefault();

		var username = $scope.user.email;
		var password = $scope.user.password;

		loginObj.$authWithPassword({
			email:username,
			password:password
		}).then(function(user){
			login.loading = false;
			console.log("Authentication successful...");
			LoginService.setUser(user.password.email);
			$location.path('/home');
		},function(error){
			login.loading = false;
			$scope.loginError = true;
			$scope.loginErrorMessage = error.message;
			// login.loading = false;
			console.log("Authentication failed...");
		});
	}
}])


.directive('laddaLoading', [
	function() {
		return {
			link: function(scope, element, attrs) {
				var Ladda = window.Ladda;
				var ladda = Ladda.create(element[0]);
                // Watching login.loading for change
                scope.$watch(attrs.laddaLoading, function(newVal, oldVal) {
                    // Based on the value start and stop the indicator
                    if (newVal) {
                    	ladda.start();
                    } else {
                    	ladda.stop();
                    }
                });
            }
        };
    }
    ])


.service('LoginService',['$location','$firebaseAuth',function($location,$firebaseAuth){
	var user='';

	var firebaseObj = new Firebase("https://x-press-yeti.firebaseio.com");
	var logoutObj = $firebaseAuth(firebaseObj);

	return {
		getUser:function(){
			if(user ==''){
				user = localStorage.getItem('userEmail');
			}
			return user;
		},
		setUser: function(value){
			localStorage.setItem('userEmail',value);
			user = value;
		},
		logoutUser:function(){
    		logoutObj.$unauth();
    		console.log('done logout');
    		user='';
    		localStorage.removeItem('userEmail');
    		$location.path('/login');

		}
	}
}]);