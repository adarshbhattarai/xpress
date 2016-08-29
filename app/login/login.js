'use strict';

angular.module('myApp.login', ['ngRoute','firebase','ngNotify'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'login/login.html',
    controller: 'LoginCtrl'
  });
}])

.controller('LoginCtrl', ['ngNotify','$scope','$location','LoginService','$firebaseAuth','$firebase','$rootScope','Roles_Constant',function(ngNotify,$scope,$location,LoginService,$firebaseAuth,$firebase,$rootScope,Roles_Constant) {
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

 	/*Facebook login*/
	$scope.facebookSignup= function(){
		login.loading = true;
		event.preventDefault();
		firebaseObj.authWithOAuthPopup("facebook", function(error, authData) {
		  if (error) {
		    console.log("Login Failed!", error);
		  }
		  else {
		  	sessionStorage.sideMenu = true;
		  /*	alert("signup successfully through facebook....")*/
			console.log("facebook singup..");
			console.log(authData.facebook.public_profile);
			console.log("Authentication successful...");
		    // the access token will allow us to make Open Graph API calls
		    console.log(authData.facebook.accessToken);
		    console.log("Authenticated successfully with payload:", authData);
    		$scope.facebookProfile = authData.facebook.profileImageURL;
    		$scope.facebookEmail = authData.facebook.email;
    		$scope.facebookUserAddress  = authData.facebook.user_hometown;

    		var firebaseObj = new Firebase("https://x-press-yeti.firebaseio.com/user/business_customer");
    		LoginService.setUser(authData.facebook.email);
    		var fb = $firebase(firebaseObj);
        	var user = LoginService.getUser();
        	var firstName = authData.facebook.cachedUserProfile.first_name;
        	var lastName = authData.facebook.cachedUserProfile.last_name;
        	var email = authData.facebook.email;
          	$scope.profilePictureURL = authData.facebook.profileImageURL;
        	var profilePic = authData.facebook.profileImageURL;
        	var role = 'USER';
        	console.log("User role is: "+role);
			firebaseObj.once("value", function(snapshot) {
				var count = false; 
				snapshot.forEach(function(messageSnapshot) {
					if(messageSnapshot.child("email").val() == $scope.facebookEmail)
					{
						count = true;
						console.log("Pushed or not .... If this comes then it is npt pushed to the database");
						
					}	
					
			  	});
				/*storing facebook information in business_customer*/
				if(!count){
					console.log("Pushed or not .... If this comes then it is pushed to database");
					fb.$push({
		            firstName:firstName,
		            lastName:lastName,
		            email:email,
		            emailId:user,
		            role:role,
		            profilePictureURL:profilePic,
		            '.priority':user      
		        	}).then(function(ref){
			            console.log(ref); 
			            console.log("Saved Successfully");
			            console.log(firstName);
			            console.log(user);
			           $location.path('/home');       
		        	},function(error){
			            console.log("error: ");
			            console.log(error);
		        	});
				} 
				else{   
					console.log("count= "+ count)
					$location.path('/home').replace();
					$scope.$apply();   

				}
			}); 
		  }
		},


		{
		  scope: "email,user_likes,public_profile,user_hometown,user_birthday,user_location" // the permissions requested
		})  
	}

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
    				/*ngNotify.set('Login successful.','success'); */
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
			login.loading = false;
			console.log("Authentication failed...");
			ngNotify.set('Error in login.','error'); 
		});
	}
/*	$scope.messageAlert = false;
	$scope.messageAlertError = false;*/
	/*Forgot password*/
	$scope.resetPassword= function(){
		console.log("password reset");
		var email = $scope.email;
		console.log(email);
		console.log($scope.email);
		/*$scope.messageAlert = true;*/
		firebaseObj.resetPassword({
  			email: email
		}, function(error) {
  		if (error) {
    		switch (error.code) {
      			case "INVALID_USER":
        		console.log("The specified user account does not exist.");
        		alert("The specified user account does not exist.");
       	 		break;
      		default:
        	console.log("Error resetting password:", error);
    		}
  		} else {
    		console.log("Password reset email sent successfully!");
    		alert("Password reset email sent successfully! \n Check your email: "+ $scope.email);
  	}
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
    		sessionStorage.clear();
    		$location.path('/login');
    		

		}
	}
}]);