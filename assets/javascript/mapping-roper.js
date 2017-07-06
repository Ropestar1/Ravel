// FIREBASE
// Initialize Firebase
var config = {
    apiKey: "AIzaSyBGKxL60DKgOYk5ZXDQZuv_qJ6h_ptZaf0",
    authDomain: "ravel-test-aadbc.firebaseapp.com",
    databaseURL: "https://ravel-test-aadbc.firebaseio.com",
    projectId: "ravel-test-aadbc",
    storageBucket: "ravel-test-aadbc.appspot.com",
    messagingSenderId: "539214141426"
};

firebase.initializeApp(config);

// FIREBASE CUSTOMIZATIONS
var database = firebase.database();
var routeName;
var username;
// FIREBASE Variables

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

database.ref().on("value", function(snapshot) {
	console.log("this is the snapshot: " + snapshot)
	console.log(snapshot)
	// Print the initial data to the console.
	console.log(snapshot.val());
	// Log the value of the various properties
	// console.log(snapshot.val().username);
	// console.log(snapshot.val().routeName);
	// console.log(snapshot.val().distanceTravelled);
	// console.log(snapshot.val().time);
	// console.log(snapshot.val().speed);


	// If any errors are experienced, log them to console.
	}, function(errorObject) {
		console.log("The read failed: " + errorObject.code);
});

// when submit button is clicked
$("#submit").on("click", function(event){
    event.preventDefault();

    username = 'Roper'; //$("#name").val().trim();
    
    routeName = $("#route-name").val().trim();
    // console.log("username is : "+ username);
    // console.log("routeName is : "+ routeName);
    origin = $("#origin").val().trim();
    destination = $("#destination").val().trim();
    
    database.ref('/' + username).set({
	    // username: username,
	    namedRoute: routeName,
	    distanceTravelled : 5000, //distance,
	    timeTaken : 1000, //time,
	    // speed : speed
  	});

  	// Change the HTML
	// var row = $("<tr>");
	// row.append("<td>" +  snapshot.val().routeName + "</td>")
	// row.append("<td>" +  snapshot.val().distanceTravelled + "</td>");
	// row.append("<td>" +  snapshot.val().speed + "</td>");
	// row.append("<td>" +  snapshot.val().time + "</td>");

    //GOOGLEMAPS API CALLS
    var queryURL = 
        "https://cors-anywhere.herokuapp.com/"+
        "https://maps.googleapis.com/maps/api/directions/json?origin=" + 
        origin + "&destination=" + destination + 
        "&Mode=BICYCLING&key=AIzaSyA0oMhk60GOJSoK46J8f0dAwghkBwgThl0";

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