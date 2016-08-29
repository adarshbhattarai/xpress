'use strict'

angular.module('myApp.register',['ngRoute','firebase','ngNotify'])

//declared route
.config(['$routeProvider',function($routeProvider){
	$routeProvider.when('/register',{
		templateUrl: 'register/register.html',
		controller : 'RegisterCtrl'
	})
}])

//Register controller
.controller('RegisterCtrl',['ngNotify','$scope','$location','$firebaseAuth','$http',function(ngNotify,$scope,$location,$firebaseAuth,$http){
	var signup ={};
    $scope.signup = signup;
    $scope.emailForm = false;
    var firebaseObj = new Firebase("https://x-press-yeti.firebaseio.com");
	var auth = $firebaseAuth(firebaseObj);
/*
  $scope.messageAlert = true;
	$scope.signUp = function(){
*/

//First I asked for the email address ($scope.next), then a random password was generated and the account was created
//with that random password. 
//Then I called firebase reset password method to send the user the random token that can actually login to the system
// I called it a verification code
//Then I called firebase changepassword method to set up a new password
// this way the email was verified.
// I deleted the user email id from the realtime database, if it was not able to send the email.
// Firebase is still experimenting email verification. So, until they comeup with it, we will hack it like this.

	$scope.next = function(){
    signup.loading = true;
		if(!$scope.regForm.$invalid){
      console.log($scope.generateRandomPassword());
			var email = $scope.user.email;

           var password = $scope.generateRandomPassword();
           $scope.generatedPassword = password;
           console.log("Password" + password);
            if (email && password) {
                auth.$createUser(email, password)
                    .then(function() {
                      $scope.emailForm = true;
                        $scope.verificationForm = true;
                        signup.loading =false;
                   console.log('User creation success');
                   $scope.verification();
                       // $location.path('/login');
                        
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

  $scope.verification = function(){
    // do things if success
    //  user email verification
    $scope.verificationSuccess = true;
    console.log("sendEmail here");
    var emailAddress = $scope.user.email;
    firebaseObj.resetPassword({
      email: emailAddress
    }, function(error) {
        if (error) {
          switch (error.code) {
            case "INVALID_USER":
              console.log("The specified user account does not exist.");
              break;
            default:
              console.log("Error resetting password:", error);
          }
        } else {
                console.log("Password verification sent successfully!");
          }
      });                                            
  }

  $scope.createPassword = function(){
    var verificationCode = $scope.user.verification;
    console.log("verification code is: "+ verificationCode);
    var user = $scope.user.email;
    console.log("User is : "+user);
    auth.$authWithPassword({
      email:user,
      password:verificationCode
    }).then(function(user){
      alert("verification successfull...");
      $scope.passwordForm = true;
      $scope.verificationForm = false;
    },function(error){
      alert("verification failed...");
      $scope.deleteAccount();
      $location.path('/login');
    });
  }

  $scope.signUp = function(){
    var email = $scope.user.email;
    var oldPassword = $scope.user.verification;
    console.log(oldPassword);
    var newPassword = $scope.user.password; 
    var confirmPassword = $scope.user.confirmPassword;
    if(newPassword != confirmPassword) {
    // Write Something
      alert("Password Doesn't match please try again");
    }
    else{
      firebaseObj.changePassword({
        email: email,
        oldPassword: oldPassword,
        newPassword: newPassword
      }, function(error) {
          if (error) {
            switch (error.code) {
              case "INVALID_PASSWORD":
                console.log("The specified user account password is incorrect.");
                break;
              case "INVALID_USER":
                console.log("The specified user account does not exist.");
                break;
              default:
                console.log("Error changing password:", error);
            }

          } else {          
              console.log("User password changed successfully!");
              
              /*$location.path('/login');*/
            }
        });
      /*alert('Account created successfully. You can login now...');*/
     ngNotify.set('Account created successfully. You can login now....','success'); 
    }
     $location.path('/login');
  }


  $scope.generateRandomPassword = function(){
      var password = "";
      var randomGenerator = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      for (var i=0; i<16; i++){
        password += randomGenerator.charAt(Math.floor(Math.random()*randomGenerator.length));
      }
      return password;
  }

  $scope.deleteAccount = function(){

          firebaseObj.removeUser({
            email: $scope.user.email,
            password:  $scope.generatedPassword
          }, function(error) {
            if (error) {
              switch (error.code) {
                case "INVALID_USER":
                  console.log("The specified user account does not exist.");
                  break;
                case "INVALID_PASSWORD":
                  console.log("The specified user account password is incorrect.");
                  break;
                default:
                  console.log("Error removing user:", error);
              }
            } else {
              console.log("User account deleted successfully!");
            }
          });

  }

  /*uSING MAILGUN TO VERIFY EMAIL*/

/*  var mailgunUrl = "sandboxa457ba2706314aae8b55078e7790d5b7.mailgun.org";
  var mailgunApiKey = window.btoa("api:key-02859b9c38da26d907bf27f45763e532")
  $scope.emailFrom = "@gmail.com";

  $scope.signUp = function() {
    $http({
      "method": "POST",
      "url": "https://api.mailgun.net/v3/" + mailgunUrl + "/messages",
      "headers": {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": "Basic " + mailgunApiKey
      },
      data: "from=" + "yeti.tech.xpress@gmail.com" + "&to=" + "yeti.tech.xpress@gmail.com"+ "&subject=" + "Email verification" +
       "&text=" + "Please confirm your email address by clicking the link below. \nWe may need to send you critical information about our service and it is important that we have an accurate email address.\n \n x-press-yeti.firebaseapp.com \n\n-X-press-Yeti"
    }).then(function(success) {
      console.log("SUCCESS " + JSON.stringify(success));
    }, function(error) {
      console.log("ERROR " + JSON.stringify(error));
    });
  }*/


/*  $scope.signUp = function(){
    console.log("email");
  var nodemailer = require('nodemailer');
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'yeti.tech.xpress@gmail.com',
        pass: 'x-press-2016'
    }
});

transporter.sendMail({
    from: 'yeti.tech.xpress@gmail.com',
    to: 'yeti.tech.xpress@gmail.com',
    subject: 'Testing for email verificeion',
    html: 'hello world!'
});
}*/

/*$scope.signUp = function(){
  console.log("mailgun begin");
var api_key = 'key-02859b9c38da26d907bf27f45763e532';
var domain = 'sandboxa457ba2706314aae8b55078e7790d5b7.mailgun.org';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
 
var data = {
  from: 'yeti.tech.xpress@gmail.com',
  to: 'yeti.tech.xpress@gmail.com',
  subject: 'Hello',
  text: 'Testing some Mailgun awesomness!'
};
 
mailgun.messages().send(data, function (error, body) {
  console.log(body);
});
}*/
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
/*    $scope.signUp = function() {
         console.log("success");
    $.ajax({
      type: 'POST',
      url: 'https://mandrillapp.com/api/1.0/messages/send.json',
      data: {
        'key': 'PqP0dcLgBDdaY6io0Q2Hcg',
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
}
*/
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