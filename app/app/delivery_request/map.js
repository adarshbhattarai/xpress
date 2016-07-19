$(document).ready(function(){
    if(navigator.geolocation)
        navigator.geolocation.getCurrentPosition(success,fail);
        else
            
            $("p").html("NOt Found");
    
});

function success(position){
    var googleLatalng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    
    var mapOption = {
        zoom: 15,
        center: googleLatalng,
        mapTypedId: google.maps.MapTypeId.ROAD
    }
     <!--Location to display in html page-->
    var mapPlace = document.getElementById("map");
    
    <!-- Google map display -->
    var map = new google.maps.Map(mapPlace, mapOption);
    
    addMarker(map, googleLatalng, "Current Location");
   /* $("p").html("Latitude: "+ position.coords.latitude + "<br>Longitude: "+ position.coords.longitude +
                "<br>Accuracy: "+ position.coords.accuracy);*/

}

function addMarker(map, googleLatalng, title){
    var markerOption = {
        position: googleLatalng,
        map : map,
        title: title,
        animation: google.maps.Animation.DROP
    };
    var marker = new google.maps.Marker(markerOption);
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

//For delivery location search
function initAutocomplete() {
    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
 
}




   
