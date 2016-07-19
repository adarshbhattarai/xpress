'use strict'

angular.module('myApp.adminDeliveryRequests', ['ngRoute','firebase','angularUtils.directives.dirPagination'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/admin-delivery-requests', {
		templateUrl: 'admin/NewDeliveryRequests/requests.html',
		controller: 'AdminRequestCtrl'
	});
}])
.controller('AdminRequestCtrl', ['$scope','$location','$firebase','LoginService', function($scope,$location,$firebase,LoginService) {
	var firebaseObj = new Firebase("https://x-press-yeti.firebaseio.com/delivery_request");
  $scope.username = LoginService.getUser();
    var sync = $firebase(firebaseObj);
    $scope.requests = sync.$asArray();

    $scope.getSortClass = function(column){
    if($scope.sortColumn == column){
      return $scope.reverseSort ? 'arrow-down' : 'arrow-up' 
    }
    return '';
  };
    $scope.changeValues = function(){
      firebaseObj.once("value", function(snapshot) {
	    	$scope.acceptedDeliveries = [] ;
	    	$scope.cancelledDeliveries = [];
	   
  			snapshot.forEach(function(childSnapshot) {
   				 var childData = childSnapshot.val();
   				 if(childData.status == 'APPROVED'){
   				 		$scope.acceptedDeliveries.push(childData);
   				 		$scope.requests.pop(childData);
   				 }
   				 else if (childData.status == 'CANCEL'){
   				 	$scope.cancelledDeliveries.push(childData);
   				 	/*$scope.requests.pop(childData);*/
   				 }

   				 /*else if(childData.status == 'Requested'){
   				 	$scope.requests.push(childData);
   				 	console.log("FUCK YOU BABY YAAAAA");
   				 }
*/
 			 });
		  });
    
     }

	    $scope.statusChange = function(element, request){

	    var id = request.$id;
	    console.log(id);
			var records = $scope.requests.$getRecord(id);
			records.status = element.status;
			console.log(records.status);
			$scope.requests.$save(records);
			$scope.changeValues();
	    }

	    $scope.changeValues();

    //Row limit to display
     $scope.newDeliveryRowLimit = "5";
    $scope.approvedDeliveryRowLimit = "5";
    $scope.cancelledDeliveryRowLimit = "5";

    /*Search New Requests from Drivers list*/
    $scope.searchBy="user";
    $scope.searchFromDriverList = function(item){
        var searchBy = $scope.searchBy;
        console.log("search by:"+searchBy);
        if($scope.searchDriverList === undefined && item.status == "Requested"){ //return all items
          return true;
        }
        else if(searchBy == "user" && item.status == "Requested" && (item.user.toLowerCase().indexOf($scope.searchDriverList.toLowerCase())) != -1 ){
            return true;
        }
        else if(searchBy == "fullName" && item.status == "Requested" && (item.fullName.toLowerCase().indexOf($scope.searchDriverList.toLowerCase())) != -1){
            return true;
        }
        else if(searchBy == "phone" && item.status == "Requested" && (item.phone.toString().indexOf($scope.searchDriverList.toLowerCase())) != -1){
             return true;
        } 
        else return false;
        
    };

    /*Search approved Delivery Requests from approved Delivery list*/
    $scope.searchBy="user";
    $scope.searchFromApprovedDeliveries = function(item){
        var searchBy = $scope.searchBy;
        console.log("search by:"+searchBy);
        if($scope.searchApprovedDeliveries === undefined){ //return all items
          return true;
        }
        else if(searchBy == "user" && (item.user.toLowerCase().indexOf($scope.searchApprovedDeliveries.toLowerCase())) != -1 ){
            return true;
        }
        else if(searchBy == "fullName" && (item.fullName.toLowerCase().indexOf($scope.searchApprovedDeliveries.toLowerCase())) != -1){
            return true;
        }
        else if(searchBy == "phone"  && (item.phone.toString().indexOf($scope.searchApprovedDeliveries.toLowerCase())) != -1){
             return true;
        } 
        else return false;
        
    };

    /*Search Cancelled Deliveries  from Cancelled delivery list*/
    $scope.searchBy="user";
    $scope.searchFromCancelledDeliveries = function(item){
        var searchBy = $scope.searchBy;
        console.log("search by:"+searchBy);
        if($scope.searchCancelledDeliveries === undefined){ //return all items
          return true;
        }
        else if(searchBy == "user" && (item.user.toLowerCase().indexOf($scope.searchCancelledDeliveries.toLowerCase())) != -1 ){
            return true;
        }
        else if(searchBy == "fullName" && (item.fullName.toLowerCase().indexOf($scope.searchCancelledDeliveries.toLowerCase())) != -1){
            return true;
        }
        else if(searchBy == "phone"  && (item.phone.toString().indexOf($scope.searchCancelledDeliveries.toLowerCase())) != -1){
             return true;
        } 
        else return false;
        
    };
    //Sorting New Requests from Drivers list
    $scope.sortColumn= "user";
    $scope.reverseSort=false;
    $scope.sortData = function(column){
        console.log("Bikram");
        $scope.reverseSort = ($scope.sortColumn == column)?!$scope.reverseSort:false;
        $scope.sortColumn = column;
      };

      $scope.logout = function(){
        LoginService.logoutUser();
      }

}]);
