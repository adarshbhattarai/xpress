'use strict';

angular.module('myApp.adminPannel', ['ngRoute','firebase'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/adminPannel', {
        resolve:{
            "check": function($location){
               // var data = sessionStorage.getItem('loginAsAdmin');
                console.log(sessionStorage.loggedIn);
                if(!sessionStorage.loggedIn){
                    $location.path('/login');
                }
            }

        },
		templateUrl: 'admin/adminPannel.html',
		controller: 'adminPannelCtrl'
	});
}])

.controller('adminPannelCtrl', ['$scope','$location','LoginService','$firebase', function($scope,$location,LoginService,$firebase) {
	$scope.username = LoginService.getUser();
   // $scope.editFormShow = false;
    console.log(" Reached here");
    if(!$scope.username){
        $location.path('/login');
    }

    var firebaseObj = new Firebase("https://x-press-yeti.firebaseio.com/user/business_customer");
    var sync = $firebase(firebaseObj);
    console.log(sync.$asArray());
    $scope.requests = sync.$asArray();
    console.log($scope.requests);


    $scope.update = function(request){
           // $scope.editFormShow = true ;
            $scope.editForm = true ;
            $scope.firstName = request.firstName;
            $scope.lastName = request.lastName;
            $scope.email = request.email;
            $scope.phone = request.phone;
            $scope.address = request.address;
            $scope.city = request.city;
            $scope.state = request.state;
            $scope.zip = request.zip;
            $scope.id = request.$id;
            console.log($scope.id);

    }

    $scope.deletePost = function(request){

        $scope.requests.$remove(request);
    }

    $scope.editFormSubmit = function(){
        $scope.editForm = false ;
        console.log("here");
        var id = $scope.id;
        console.log(id);
        var records = $scope.requests.$getRecord(id);
        records.firstName = $scope.firstName;
        records.lastName = $scope.lastName;
        records.email = $scope.email;
        records.phone = $scope.phone;
        records.address = $scope.address;
        records.city = $scope.city;
        records.state = $scope.state;
        records.zip = $scope.zip;
        $scope.request.$save(records);

    }

    //Row limit to display
     $scope.rowLimit = 5;

    //For search
    $scope.search = function(item){
        var searchByInput = $scope.searchBy;

        if($scope.searchText === undefined){ //return all items
            console.log("searcha by if condition "+searchByInput);
          return true;
        }
        else if(item.firstName.toLowerCase().indexOf($scope.searchText.toLowerCase()) != -1){
            console.log("search by else condition "+searchByInput);
          return true;
        }
        else return false;
        
    };
    //Sorting user list
    $scope.sortColumn= "firstName";
    $scope.reverseSort=false;
    $scope.sortData = function(column){
        console.log("Bikram");
        $scope.reverseSort = ($scope.sortColumn == column)?!$scope.reverseSort:false;
        $scope.sortColumn = column;
      };
  $scope.getSortClass = function(column){
    if($scope.sortColumn == column){
      return $scope.reverseSort ? 'arrow-down' : 'arrow-up' 
    }
    return '';
  };

    $scope.logout = function(){
        delete sessionStorage.loggedIn;
        LoginService.logoutUser();
    }
}]);