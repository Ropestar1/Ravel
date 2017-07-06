// starting coordinates
var origin;
var startLat;
var startLng;

// ending coordinates
var destination;
var endLat;
var endLng;

// google documentation had these added
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var map;


// when submit button is clicked
$("#submit").on("click", function(event){
    event.preventDefault();

    // Creates an area to put the googlemaps results
    // $('div.map-results-area').html('<div class="panel panel-primary" id="map-header-holder"></div>');
    // $('#map-header-holder').html('<div class="panel-heading panel-heading-ravel" id="map-header-text"></div>');
    // $('#map-header-text').html('<h3 class="panel-title"><strong> Map Routes </strong></h3>');

    // $('#map-header-holder').append('<div class="panel-body" id="map-body"></div>');

    origin = $("#origin").val().trim();
    destination = $("#destination").val().trim();
     // var time = $("#time").val().trim();
    var queryURL = 
        "https://cors-anywhere.herokuapp.com/"+
        "https://maps.googleapis.com/maps/api/directions/json?origin=" + 
        origin + "&destination=" + destination + 
        "&Mode=BICYCLING&key=AIzaSyA0oMhk60GOJSoK46J8f0dAwghkBwgThl0";

            // "https://maps.googleapis.com/maps/api/directions/json?&mode=BICYCLING&origin=sunnyvale&destination=cupertino&departure_time=" + time +  "&key=AIzaSyA0oMhk60GOJSoK46J8f0dAwghkBwgThl0"

    console.log(queryURL);
    
    $.ajax({
        url : queryURL,
        method : "GET",
        dataType : 'json'

    }).done(function(response){
        // debugger;
        startLat = response.routes[0].legs[0].start_location.lat;
        startLng = response.routes[0].legs[0].start_location.lng;

        endLat = response.routes[0].legs[0].end_location.lat;
        endLng = response.routes[0].legs[0].end_location.lng;

        calcRoute();
    });
});


function initialize() {
    directionsDisplay = new google.maps.DirectionsRenderer();
    var ucbe = new google.maps.LatLng(37.7918156, -122.3931774);
    var mapOptions = {
        zoom: 10,
        center: ucbe,
    }

    //might need to fix line below to take our user input. fix the document.getElementByID
    map = new google.maps.Map(document.getElementById('map-body'), mapOptions);
    directionsDisplay.setMap(map);
}

function calcRoute() {
  //origin already set in variable on click. see origin
    // var start = document.getElementById('start').value;
  // destination already set in variable on click. see destination
    // var end = document.getElementById('end').value;
  
  var request = {
    origin: origin, //might want to use a different variable name
    destination: destination, //might want to use a different variable name
    travelMode: 'BICYCLING'
  };

  directionsService.route(request, function(result, status) {
    if (status == 'OK') {
      directionsDisplay.setDirections(result);
    }
  });

  directionsDisplay.setPanel(document.getElementById('right-panel'))
}

initialize();