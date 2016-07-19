'use strict'

angular.module('myApp.driverInfo', ['ngRoute','firebase','angularUtils.directives.dirPagination'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/driver-information', {
		resolve:{
            "check": function($location){
                console.log(sessionStorage.adminRole);
                if(sessionStorage.adminRole == 'false'){
                    $location.path('/');
                }
            }

        },
		templateUrl: 'admin/driverList.html',
		controller: 'driverInformationCtrl'
	});
}])


.controller('driverInformationCtrl', ['$scope','$location','$firebase','LoginService', function($scope,$location,$firebase,LoginService) {
		
		$scope.username = LoginService.getUser();
      
       if(!$scope.username){
          $location.path('/login');
     	 }

       $scope.driverDetails = true;
       $scope.viewdetails = function(request){
        $scope.driverDetails = false;
        console.log("driver details");

        console.log(request.$id);

        $scope.firstName = request.firstName;
        $scope.middleName = request.middleName;
        $scope.lastName = request.lastName;
        $scope.address = request.address;
        $scope.city = request.city;
        $scope.state = request.state;
        $scope.zip = request.zip; 
        $scope.email = request.email;
        $scope.phone = request.phone;
        // $scope.profileImg = request.profileImg;
        $scope.licenceN0 = request.dlNO;
        $scope.expiryMonth = request.expiryDate.month;
        $scope.ecpiryYear = request.expiryDate.year;
        $scope.vehicleNo = request.vehicleNo;
        $scope.vehicleModel = request.model;
        $scope.vehicleColor = request.color;
        $scope.status = request.status;
        $scope.driverPicture = request.profilepicture; 
        /*$scope.documents = request.documents;*/
        $scope.insuranceDocument = request.insuranceDoc;

         $scope.accept = function(){

           var id = request.$id;
        var records = $scope.requests.$getRecord(id);

           records.status = 'ACCEPT';
           $scope.requests.$save(records);
          $scope.changeValues();
            console.log(records.status);
            console.log(records.firstName);
            $scope.driverDetails = true;

         }

          $scope.decline = function(){

       var id = request.$id;
        var records = $scope.requests.$getRecord(id);

           records.status = 'CANCEL';
           $scope.requests.$save(records);
          $scope.changeValues();
           $scope.driverDetails = true;

         }


      }




	    var firebaseObj = new Firebase("https://x-press-yeti.firebaseio.com/user/driver");
	    var sync = $firebase(firebaseObj);
	    console.log(sync.$asArray());
	    $scope.requests = sync.$asArray();
	    console.log($scope.requests);
	    
	    $scope.changeValues = function(){
	    firebaseObj.once("value", function(snapshot) {
	    	$scope.approvedDrivers = [];
	    	$scope.pendingDrivers = [];
	    	$scope.cancelledDrivers = [];
  			snapshot.forEach(function(childSnapshot) {
   				 var childData = childSnapshot.val();
   				 if(childData.status == 'ACCEPT'){
   				 		$scope.approvedDrivers.push(childData);
   				 }
   				else if(childData.status == "PENDING"){
   						$scope.pendingDrivers.push(childData);
   				 }


   				 else{
   				 	$scope.cancelledDrivers.push(childData);
            }

 			 });
		});

	      }

	    $scope.statusChange = function(element, request){

	    	var id = request.$id;
	/*		console.log(id);
			console.log(element.status);*/
			var records = $scope.requests.$getRecord(id);
/*			console.log(records);*/
			records.status = element.status;
			$scope.requests.$save(records);
			$scope.changeValues();
	    }

	    $scope.changeValues(); 
		$scope.update = function(request){

			var id = request.$id;
			console.log(id);

		}

    $scope.deletePost = function(request){
        var id = request.$id;
        $scope.requests.$remove(request);

    }
    

		//Row limit to display
     $scope.rowLimit = "5";

    //For search

  /*  $scope.searchList = ["First_Name", "Last_Name","email", "Phone","Address","City","State","Zip"];*/

    //Searching for particular field, search through phone not working
   /* $scope.search = "";*/
    $scope.searchBy="firstName";
    $scope.search = function(item){
        var searchBy = $scope.searchBy;
        console.log("search by:"+searchBy);
        if($scope.searchText === undefined){ //return all items
          return true;
        }
        else if(searchBy == "firstName" && (item.firstName.toLowerCase().indexOf($scope.searchText.toLowerCase())) != -1 ){
            return true;
        }
        else if(searchBy == "lastName" && (item.lastName.toLowerCase().indexOf($scope.searchText.toLowerCase())) != -1){
            return true;
        }
        else if(searchBy == "phone" && (item.phone.toString().indexOf($scope.searchText.toLowerCase())) != -1){
             return true;
        } 
        else if(searchBy == "address" && (item.address.toLowerCase().indexOf($scope.searchText.toLowerCase())) != -1){
            return true;
        }
        else if(searchBy == "city" && (item.city.toLowerCase().indexOf($scope.searchText.toLowerCase())) != -1){
            return true;
        }
        else if(searchBy == "state" && (item.state.toLowerCase().indexOf($scope.searchText.toLowerCase())) != -1){
            return true;
        }        else if(searchBy == "zip" && (item.zip.toString().indexOf($scope.searchText.toLowerCase())) != -1){

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
        LoginService.logoutUser();
    }

	}]);
