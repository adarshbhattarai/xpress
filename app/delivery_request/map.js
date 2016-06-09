 var mapPlace, map;

 function myPrivateListener() {
          var place= destinationBox.getPlace();
          var address = place.formatted_address;

          var geocoder = new google.maps.Geocoder();

geocoder.geocode( { 'address': address}, function(results, status) {

  if (status == google.maps.GeocoderStatus.OK) {
    var latitude = results[0].geometry.location.lat();
    var longitude = results[0].geometry.location.lng();

    var googleLatLngDestination = new google.maps.LatLng(latitude,longitude);
    
    var mapOption = {
        zoom: 10,
        center: googleLatLngDestination,
        mapTypedId: google.maps.MapTypeId.ROAD
    }
    
    addMarker(map, googleLatLngDestination, "destination Location");
  } 
}); 
    }

    function myPackageListener() {
          var place= searchBox.getPlace();
          var address = place.formatted_address;

          var geocoder = new google.maps.Geocoder();

geocoder.geocode( { 'address': address}, function(results, status) {

  if (status == google.maps.GeocoderStatus.OK) {
    var latitude = results[0].geometry.location.lat();
    var longitude = results[0].geometry.location.lng();

    var googleLatLngDestination = new google.maps.LatLng(latitude,longitude);
    
    var mapOption = {
        zoom: 10,
        center: googleLatLngDestination,
        mapTypedId: google.maps.MapTypeId.ROAD
    }
    
    addMarker(map, googleLatLngDestination, "package Location");
  } 
}); 
    }

//For delivery location search
function initAutocomplete() {
    var input = document.getElementById('pac-input');
    searchBox = new google.maps.places.Autocomplete(input);
    searchBox.addListener('place_changed',myPackageListener);

    //for destination address
    var output = document.getElementById('destination');
    destinationBox = new google.maps.places.Autocomplete(output);
    destinationBox.addListener('place_changed',myPrivateListener);
}


$(document).ready(function(){
    if(navigator.geolocation)
        navigator.geolocation.getCurrentPosition(success,fail);
        else
            
            $("p").html("NOt Found");
    
});

function success(position){
    var googleLatalng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    
    var mapOption = {
        zoom: 10,
        center: googleLatalng,
        mapTypedId: google.maps.MapTypeId.ROAD
    }
     <!--Location to display in html page-->
     mapPlace = document.getElementById("map");
    
    <!-- Google map display -->
    map = new google.maps.Map(mapPlace, mapOption);
    
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






   
