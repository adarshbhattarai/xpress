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
  'myApp.geographicLocation'
  /*'myApp.geographicLocation'*/

]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({
  	redirectTo: '/login'
  });
}]);
