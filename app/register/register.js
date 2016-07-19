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
.controller('RegisterCtrl',['$scope','$location','$firebaseAuth','$http',function($scope,$location,$firebaseAuth,$http){
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


/* $scope.signUp = function(){
  var sg = require('sendgrid').SendGrid(qcx5Dek35Jmrwq6f1Oncng)

// GET Collection
var request = sg.emptyRequest()
request.method = 'GET'
request.path = '/v3/api_keys'
sg.API(request, function (response) {
  console.log(response.statusCode)
  console.log(response.body)
  console.log(response.headers)
})
}*/


    /*email testing*/
    /*$scope.signUp = function() {
         console.log("success");
    $.ajax({
      type: 'POST',
      url: 'https://mandrillapp.com/api/1.0/messages/send.json',
      data: {
        'key': 'qcx5Dek35Jmrwq6f1Oncng',
        'message': {
          'from_email': 'yeti.tech.xpress@gmail.com',
          'to': [
              {
                'email': 'yeti.tech.xpress@gmail.com',
                'name': 'Bikram',
                'type': 'to'
              }
            ],
          'autotext': 'true',
          'subject': 'Email testing',
          'html': 'YOUR EMAIL CONTENT HERE! YOU CAN USE HTML!'
        }
      }
     }).done(function(response) {
        console.log("error");
       console.log(response); // if you're into that sorta thing
     });
}*/

 /*    $scope.signUp = function() {
        // create a new instance of the Mandrill class with your API key
        console.log("send email....");
        var m = new mandrill.Mandrill('qcx5Dek35Jmrwq6f1Oncng');
        // Collect Inputs
        var email = $scope.user.email;
        var name = "Bikram";
        var subject = "email testing";
        var message = "Email confirmation";
        var emailBody = "From: " + name + "<br><br>" +  + "Subject: " + subject + "<br><br>" + message;

        var params = {

            "message": {
                "from_email":email,
                "to":[{"email":"myemail@hotmail.com"}],
                "subject": "New email from website",
                "html": emailBody
            }
        };

        m.messages.send(params);
      };*/
}]);