/*var myApp =angular.module("myApp",[]);

myApp.directive("myMaps",function(){
    return{
        restrict: 'E',
        template:'<div></div>',
        replace:true,
        link:function(scope, element, attrs){
            var myLatLng = new google.maps.myLatLng(28, 83);
            var mapOptions = {
                center: myLatLng,
                zoom: 16,
                mapTypeId: google.maps.mapTypeId.ROADMAP
            };  
            var map = new google.maps.Map(document.getElementById(attrs.id)), mapOptions);
            var marker = new google.maps.Marker({
                position: myLatLng,
                map: map,
                title: "My town"
            });
            marker.setMap(map);
        }
    };
});*/