'use strict';

angular.module('myApp.login', ['ngRoute','firebase'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'login/login.html',
    controller: 'LoginCtrl'
  });
}])

.controller('LoginCtrl', ['$scope','$location','LoginService','$firebaseAuth','$firebase','$rootScope','Roles_Constant',function($scope,$location,LoginService,$firebaseAuth,$firebase,$rootScope,Roles_Constant) {
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
		$scope.username = username;
		loginObj.$authWithPassword({
			email:username,
			password:password
		}).then(function(user){
			login.loading = false;
			console.log("Authentication successful...");
			/*sessionStorage.setItem('isAdmin', false);*/
			LoginService.setUser(user.password.email);		
			var firebaseObj = new Firebase("https://x-press-yeti.firebaseio.com/user/business_customer");
			console.log("Username " + $scope.username);
			var sync = $firebase(firebaseObj.startAt($scope.username).endAt($scope.username));
			console.log(sync);
			var test = sync.$asArray();
			test.$loaded().then(function(array) {
				console.log(array[0]);
			    var details = array[0];
			    sessionStorage.sideMenu = false;
			    /*console.log(Roles_Constant.Roles['admin']);*/
			    if(details=== null || details === undefined){
			    	console.log("new user");
			    	sessionStorage.sideMenu = true;
			    	$location.path('/addDetails');
			    }	    
			   /* console.log("Here role is: "+role);
			    console.log(Roles_Constant.Roles['admin']);*/

			    /*Check role of user*/
			    else if(details.role === Roles_Constant.Roles['user']){
			    	console.log("this is user");
    				//console.log("Good user: "+sessionStorage.role);
    				/*sessionStorage.adminRole = false;*/
    				sessionStorage.adminRole = false;
    				console.log("User is admin: "+sessionStorage.adminRole);
    				$location.path('/home');
    			}
    			else if(details.role === Roles_Constant.Roles['admin']){
    				console.log("this is admin");
    				sessionStorage.adminRole = true;
    				console.log("Good admin: "+sessionStorage.adminRole);		
    				$location.path('/adminPannel');
    			}
    			else $location.path('/home');
				});

			/*<!--For administrative login||| hardcoded for now,need to modify...Bikram-->
			if( $scope.user.email=='admin@gmail.com' && $scope.user.password=='admin'){
				console.log("login as admin");
				sessionStorage.setItem('isAdmin', true);
				$location.path('/adminPannel');
			}*/


			/*else*/
			/*$location.path('/home');*/

		},function(error){
			login.loading = false;
			$scope.loginError = true;
			$scope.loginErrorMessage = error.message;
			// login.loading = false;
			console.log("Authentication failed...");
		});
	}

	//Alterntate way of login
	/*$scope.SignIn = function(event){
	
		firebaseRole.on("value", function(snapshot) {
  			console.log(snapshot.val());
  			var data = snapshot.val();
  			var city = data.city;
 			console.log(city);
			}, function (errorObject) {
  			console.log("The read failed: " + errorObject.code);
		})
		login.loading = true;

		event.preventDefault();

		var username = $scope.user.email;
		var password = $scope.user.password;
		loginObj.$authWithPassword({
			email:username,
			password:password
		}).then(function(user){
			login.loading = false;
			console.log("Authentication successful...");*/
			/*sessionStorage.loggedIn = false;
			sessionStorage.setItem('isAdmin', false);
			LoginService.setUser(user.password.email);
			/*<!--For administrative login||| hardcoded for now,need to modify...Bikram-->*/
			/*if( $scope.user.email=='admin@gmail.com' && $scope.user.password=='admin'){
				console.log("login as admin");
				// Save data to sessionStorage
				sessionStorage.setItem('isAdmin', true);
				/*$sessionStorage.loggedIn =true;*/
				/*$rootScope.$admin = true;
				$location.path('/adminPannel');
			}
			else
			$location.path('/home');

		},function(error){
			login.loading = false;
			$scope.loginError = true;
			$scope.loginErrorMessage = error.message;
			// login.loading = false;
			console.log("Authentication failed...");
		});
	}*/
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