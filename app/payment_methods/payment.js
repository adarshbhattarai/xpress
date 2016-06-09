'use strict'

angular.module('myApp.paymentBrainTree', ['ngRoute','firebase'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/payment', {
		templateUrl: 'payment_methods/payment.html',
		controller: 'PaymentCtrl'
	});
}])

.controller('PaymentCtrl', ['$scope','$location','$firebase','$http','LoginService', function($scope,$location,$firebase,$http,LoginService) {
    $scope.successOrErrorMessage = '';
    $scope.location = $location;
    $scope.$watch('location.search()', function() {
        $scope.successOrErrorMessage = ($location.search()).msg;
    }, true);

   
  $.getScript( "https://js.braintreegateway.com/v2/braintree.js", function() {
    
    console.log("Second Error");
 
   $.ajax({
        url: '/payment',
        type: "GET",
        crossDomain: true,
        //dataType : 'json',
        success: function(clientToken){
         // alert('Ahhh:'+clientToken.token);
          var token = clientToken.token;
          braintree.setup(token, "dropin", {
                  container: "payment-form"
          });
        },
        error: function(xhr, ajaxOptions, thrownError) {
        alert(xhr.status);
        alert(thrownError);
      }
    });
  
 /*  $http.post('http://localhost:9000/payment', {customer_id: 'some-id'})
          .then(function(token) {
            braintree.setup(token, "dropin", {
        container: "payment-form"
      });
      }, function(err) {
        // Do something with error
      });*/

});

/*$scope.makePayment = function(){
    $.ajax({
        url: '/process',
        type: "POST",
        dataType : 'json',
        data: {
            id: $('#guid').val(),
            title: $('#page_title').val(),
            content: $('#page-content').val()
        },
        contentType: "application/json",

        success: function(clientToken){
         // alert('Ahhh:'+clientToken.token);
          var token = clientToken.token;
          braintree.setup(token, "dropin", {
                  container: "payment-form"
          });
        },
        error: function(xhr, ajaxOptions, thrownError) {
        alert(xhr.status);
        alert(thrownError);
      }
    });
}*/

}]);