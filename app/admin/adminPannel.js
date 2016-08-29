'use strict';

angular.module('myApp.adminPannel', ['ngRoute','firebase','angularUtils.directives.dirPagination'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/adminPannel', {
        resolve:{
            "check": function($location){
                console.log(sessionStorage.adminRole);
                if(sessionStorage.adminRole == 'false'){
                    $location.path('/');
                }
            }

        },
		templateUrl: 'admin/adminPannel.html',
		controller: 'adminPannelCtrl'
	});
}])

.controller('adminPannelCtrl', ['$scope','$location','LoginService','$firebase','Roles_Constant', function($scope,$location,LoginService,$firebase,Roles_Constant) {
	$scope.username = LoginService.getUser();

    /*console.log("this is "+Roles_Constant.Roles['admin']);*/
   // $scope.editFormShow = false;
    if(!$scope.username){
        $location.path('/login');
    }

    var firebaseObj = new Firebase("https://x-press-yeti.firebaseio.com/user/business_customer");
    var sync = $firebase(firebaseObj);
    $scope.requests = sync.$asArray();

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


/*delivery details*/
var ref = new Firebase("https://x-press-yeti.firebaseio.com/delivery_request");
var sync = $firebase(ref);
ref.once("value", function(snapshot) {
  $scope.countNewDelivery = snapshot.numChildren();
  var approvedcount =0;
  var cancelledcount =0 ;
  var pendingCount = 0;
  console.log(snapshot.val());

    snapshot.forEach(function(childSnapshot) {
    var childData = childSnapshot.val();
    
    if(childData.status == 'APPROVED'){
    
        approvedcount++;

        }
     else if(childData.status == 'Requested'){
    
        pendingCount++;

        }
    else if (childData.status == 'CANCEL'){
    cancelledcount ++ ;


    }


});

    $scope.approvedDeliveriesCount = approvedcount;
    $scope.cancelledDeliveriesCount = cancelledcount;
    $scope.pendindgRequestCount = pendingCount;
    console.log("Counts");

});

/*Driver details*/
var driverObj = new Firebase("https://x-press-yeti.firebaseio.com/user/driver");
var sync = $firebase(driverObj);
driverObj.once("value", function(snapshot) {
  $scope.countDriverRequest = snapshot.numChildren();
  var approvedcount =0;
  var cancelledcount =0 ;
  var pendingCount = 0;

    snapshot.forEach(function(childSnapshot) {
    var childData = childSnapshot.val();
    
    if(childData.status == 'ACCEPT'){
    
        approvedcount++;

        }
     else if(childData.status == 'PENDING'){
    
        pendingCount++;

        }
    else if (childData.status == 'CANCEL'){
    cancelledcount ++ ;


    }


});

    $scope.approvedDriverCount = approvedcount;
    $scope.cancelledDriverCount = cancelledcount;
    $scope.pendindgDriverCount = pendingCount;
    console.log(approvedcount);
    console.log(cancelledcount);
    console.log("Counts");

});







    $scope.logout = function(){
        LoginService.logoutUser();
    }
}]);