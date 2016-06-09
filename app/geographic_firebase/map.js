$(function(){
var map;
initialize();
$.getScript("apigoogle.js", function(){

  console.log("Reached here");

});
function initialize() {

console.log("fuk");


  var mapOptions = {
    zoom: 8,
    center: new google.maps.LatLng(-34.397, 150.644),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);
  var polygonCoords = [
    new google.maps.LatLng(25.774252, -80.190262),
    new google.maps.LatLng(18.466465, -66.118292),
    new google.maps.LatLng(32.321384, -64.757370),
    new google.maps.LatLng(25.774252, -80.190262)
  ];
  var north = new google.maps.LatLng(), west = new google.maps.LatLng(), east = new google.maps.LatLng(), south = new google.maps.LatLng();
  north = polygonCoords[0];
  west = polygonCoords[0];
  east = polygonCoords[0];
  south = polygonCoords[0];

  for (i = 1; i < polygonCoords.length; i++) {
    if (north.lat < polygonCoords[i].lat) {
        north = polygonCoords[i];
    }
    if (south.lat > polygonCoords[i].lat) {
         south = polygonCoords[i];
    }
    if (west.lng > polygonCoords[i].lng) {
        west = polygonCoords[i];
    }
    if (east.lng < polygonCoords[i].lng) {
        east = polygonCoords[i];
    }
  }

    var center = new google.maps.LatLng(0,0);
    center.lat = (north.lat + south.lat) / 2;
    center.lng = (west.lng + east.lng) / 2;
    var num = (north.lat + south.lat) / 2;
    console.log(num);
}

// google.maps.event.addDomListener(window, 'load', initialize);

});

