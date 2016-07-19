var mapPlace, map;
//For location search
function initAutocomplete() {
                var firebaseObj = new Firebase("https://x-press-yeti.firebaseio.com/delivery_request");
    
    firebaseObj.on('child_added', function(snapshot){
        var data = snapshot.val();
       console.log(data);
        var packageLatitude = data.packageLatitude;
        var packageLongitude = data.packageLongitude;
        var destLatitude = data.destinationLatitude;
        var destLongitude = data.destinationLongitude;
        var googleLatLngPackage = new google.maps.LatLng(packageLatitude,packageLongitude);
         var googleLatLngDestination = new google.maps.LatLng(destLatitude,destLongitude);
        addMarker(map,googleLatLngPackage , "Package Info", 'green',data);
        addMarker(map, googleLatLngDestination, "Destination Info", 'blue',data);
    });

}
$(document).ready(function(){
    if(navigator.geolocation)
        navigator.geolocation.getCurrentPosition(success,fail);
        else
            
            $("p").html("NOt Found");
    
});
function success(position){
    var googleLatalng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    console.log(position.coords.latitude );
        console.log( position.coords.longitude);

    var mapOption = {
        zoom: 10,
        center: googleLatalng,
        scrollwheel: false,
        disableDoubleClickZoom: false,
        mapTypedId: google.maps.MapTypeId.ROAD
    }
     <!--Location to display in html page-->
     mapPlace = document.getElementById("map");
    
    <!-- Google map display -->
    map = new google.maps.Map(mapPlace, mapOption);
    
    addMarker1(map, googleLatalng, "Current Location", "red");
   /* $("p").html("Latitude: "+ position.coords.latitude + "<br>Longitude: "+ position.coords.longitude +
                "<br>Accuracy: "+ position.coords.accuracy);*/
    

}
function addMarker1(map, googleLatalng, title, pointerColor){
    var markerOption = {
        position: googleLatalng,
        map : map,
        title: title,
        icon: 'https://maps.google.com/mapfiles/ms/icons/'+pointerColor+'-dot.png',
        animation: google.maps.Animation.DROP
    };

    var marker = new google.maps.Marker(markerOption);
    var contentString="Testing";
    marker.addListener('click', function() {
        infowindow.close(); 
        infowindow.open(map, marker);
    });
    var infowindow = new google.maps.InfoWindow({
          content: contentString
    });
   

}

function addMarker(map, googleLatalng, title, pointerColor,data){
    var markerOption = {
        position: googleLatalng,
        map : map,
        title: title,
        icon: 'https://maps.google.com/mapfiles/ms/icons/'+pointerColor+'-dot.png',
        animation: google.maps.Animation.DROP
    };

    var marker = new google.maps.Marker(markerOption);
    var contentString= '<div id="content">'+
            '<div id="siteNotice">'+
            '</div>'+
            '<h4 id="firstHeading" >'+title+'</h1>'+
            '<div id="bodyContent">'+
            '<b>User: </b>'+data.user+'<br>'+
            '<b>Package Address: </b>'+data.address+'<br>'+
            '<b>Destiantion Address: </b>'+data.destinationAddress+'<br>'+
            '</div>'+
            '</div>';
    marker.addListener('click', function() {
          infowindow.open(map, marker);
    });
    var infowindow = new google.maps.InfoWindow({
          content: contentString
    });
   

}

function fail(error){
    var errorType = {
        0: "Unknown Error",
        1: "Permission Denied by the user",
        2: "Position of the user not available",
        3: "Request time out"
    };
    var errMsg = errorType[error.code];
    if(error.code == 0 || error.code == 2){
        errMsg = errMsg + " " + error.message;
    }
    $("p").html(errMsg);
}