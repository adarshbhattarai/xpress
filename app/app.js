'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.login',
  'myApp.register',
  'myApp.dashboard',
  'myApp.addDetails',
  'myApp.version',
  'myApp.delivery_request',
  'myApp.delivery_guy',
  'myApp.dvguy_response',
  'myApp.driverInfo',
  'myApp.cust_request',
  'myApp.logout',
  'myApp.settings',
  'myApp.geographicLocation',
  'myApp.paymentBrainTree',
  'myApp.adminPannel',
  'myApp.driverInfo',
  'myApp.roles',
  'myApp.driverRegistration',
  'myApp.fileUpload',
  'myApp.adminDeliveryRequests',
  'myApp.adminSettings',
  'myApp.header',



  /*'myApp.geographicLocation'*/

]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({
  	redirectTo: '/login'
  });
}])

/*ngNotify for angular notification*/
.run([
  'ngNotify',
  function(ngNotify) {
    
    ngNotify.config({
    theme: 'pure',
    position: 'top',
    duration: 3000,
    sticky: false,
    button: true,
    html: false,
    maximumOpen : 5

    }); 
  }
])
.run(function($rootScope,LoginService, $location) {
 /* console.log("Session clear...");*/
  var lastDigestRun = new Date();
  /*console.log(lastDigestRun);*/
  setInterval(function () {
    console.log("setInterval executed");
        var now = Date.now();
        if (now - lastDigestRun >10 * 60 * 1000) {
          /*console.log("Yime now" + now);*/
          //console.log("if condition executed");
          $location.path('/login').replace();
          $rootScope.$apply();
          sessionStorage.clear();
         /* console.log("Executed Session out");*/
          LoginService.logoutUser();
        }
    },  5* 60* 1000);

    $rootScope.$watch(function() {
      var now = Date.now();
        lastDigestRun = new Date();
    });
})

;
