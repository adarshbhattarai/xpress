'use strict'

angular.module('myApp.register',['ngRoute','firebase'])

//declared route
.config(['$routeProvider',function($routeProvider){
	$routeProvider.when('/register',{
		templateUrl: 'register/register.html',
		controller : 'RegisterCtrl'
	})
}])

//Register controller
.controller('RegisterCtrl',['$scope','$location','$firebaseAuth',function($scope,$location,$firebaseAuth){
	var signup ={};
    $scope.signup = signup;

    var firebaseObj = new Firebase("https://x-press-yeti.firebaseio.com");
	var auth = $firebaseAuth(firebaseObj);

	$scope.signUp = function(){
        signup.loading = true;
		if(!$scope.regForm.$invalid){
			var email = $scope.user.email;
            var password = $scope.user.password;
            if (email && password) {
                auth.$createUser(email, password)
                    .then(function() {
                        // do things if success
                        signup.loading =false;
                        console.log('User creation success');
                        $location.path('/login');
                    }, function(error) {
                        // do things if failure
                        signup.loading =false;
                        console.log(error);
                        $scope.regError = true;
                    	$scope.regErrorMessage = error.message;
                    });
            }
		}
	}
}]);