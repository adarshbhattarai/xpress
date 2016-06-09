'use strict';
 
angular.module('myApp.addPost', ['ngRoute','firebase'])
 
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/addPost', {
        templateUrl: 'onlyForTemplate/addPost.html',
        controller: 'AddPostCtrl'
    });
}])
 
.controller('AddPostCtrl', ['$scope','$location','$firebase','LoginService', function($scope,$location,$firebase,LoginService) {
    if(!LoginService.getUser()){
        $location.path('/login');
    }

    var firebaseObj = new Firebase("https://x-press-yeti.firebaseio.com/articles");
    var fb = $firebase(firebaseObj);

    $scope.addPost = function(){
        var title = $scope.article.title;
        var post = $scope.article.post;
        var user = LoginService.getUser();

        fb.$push({
            title:title,
            post:post,
            emailId:user,
            '.priority':user
        }).then(function(ref){
            console.log(ref);
            $location.path('/home');
        },function(error){
            console.log("error: ");
            console.log(error);
        });
    }

    $scope.logout = function(){
        LoginService.logoutUser();
    }
}]);