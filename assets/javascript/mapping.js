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

// firebase variables
var database = firebase.database();
var routeName;
var username;
var userList = [];

// starting coordinates
var origin;
var startLat;
var startLng;

// ending coordinates
var destination;
var endLat;
var endLng;

var distance;

// google documentation had these added
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var map;

database.ref().on("value", function(snapshot) {
	console.log("this is the snapshot: " + snapshot)
    
    userList = Object.keys(snapshot.val());
    // routesList = Object.keys(snapshot.val());
    // debugger;

	// If any errors are experienced, log them to console.
	}, function(errorObject) {
		console.log("The read failed: " + errorObject.code);
});

$('#new-user').on('click', function(event){
    // LOWERCASE THE INPUT
    // MAKE SURE NO SPACES OR SPECIAL CHARACTERS
    event.preventDefault();
    username = $('#username-input').val().trim();
    
    if (userList.length > 0 && userList.indexOf(username) >= 0) {
        // USE DIFFERENT WAY TO OUTPUT ERROR
        alert('Username exists, please use the "Log In" button.');
    }

    else {
        $('.username-swap').text(username);
        $('#splash-page').hide();
        $('#main-wrapper').show();

        // database.ref('/' + username).set({
        //     routeNameKey: '',
        //     distanceTravelled: 0,
        //     timeTaken: 0,
        //     avgSpeed : 0
        // });
        
        initialize();
    }
});

$('#login').on('click', function(event){
    // LOWERCASE THE INPUT ?
    // MAKE SURE NO SPACES OR SPECIAL CHARACTERS ?
    event.preventDefault();
    username = $('#username-input').val().trim();
    
    if (userList.length >= 0 && userList.indexOf(username) === -1) {
        // USE DIFFERENT WAY TO OUTPUT ERROR
        alert('Username does not exist. Please use the "New User" button.');
    }

    else {
        $('.username-swap').text(username);
        $('#splash-page').hide();
        $('#main-wrapper').show();
        initialize();
        
        return database.ref(username).orderByKey().once('value').then(function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                // key will be "ada" the first time and "alan" the second time
                // var key = childSnapshot.key;
                // childData will be the actual contents of the child
                var childData = childSnapshot.val();
                console.log(childData);

                // debugger;
                var fbStart = childData.startPoint;
                var fbEnd = childData.endPoint;
                var fbRouteName = childSnapshot.key;
                var fbDistTrav = childData.distanceTravelled;
                var fbAvgSpeed = childData.avgSpeed;
                var fbTime = childData.timeTaken;

                // console.log('fbStart', fbStart);
                // console.log('fbEnd', fbEnd);
                // console.log('fbRouteName', fbRouteName);
                // console.log('fbDistTrav', fbDistTrav);
                // console.log('fbAvgSpeed', fbAvgSpeed);
                // console.log('fbTime', fbTime);

                $('#user-stats').append('<tr id="' + fbRouteName + '"></tr>');

                $('#' + fbRouteName).append('<td>' + fbStart + '</td>');
                $('#' + fbRouteName).append('<td>' + fbEnd + '</td>');
                $('#' + fbRouteName).append('<td>' + fbRouteName + '</td>');
                $('#' + fbRouteName).append('<td>' + fbDistTrav + '</td>');
                $('#' + fbRouteName).append('<td>' + fbAvgSpeed + '</td>');
                
                if (fbTime === 'tbd') {
                    $('#' + fbRouteName).append('<td>' + fbTime + '</td>');
                }
                else {
                    $('#' + fbRouteName).append('<td>' + fbTime + '</td>');
                }

            });
        });

        // database.ref('/' + username).set({
        //     routeNameKey: '',
        //     distanceTravelled: 0,
        //     timeTaken: 0,
        //     avgSpeed : 0
        // });

        
    }
});


// when submit button is clicked
$("#submit").on("click", function(event){
    event.preventDefault();
    
    routeName = $("#route-name").val().trim();
    origin = $("#origin").val().trim(); //maybe change the variable name
    destination = $("#destination").val().trim(); //maybe change the variable name
   
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
        startLat = response.routes[0].legs[0].start_location.lat;
        startLng = response.routes[0].legs[0].start_location.lng;

        endLat = response.routes[0].legs[0].end_location.lat;
        endLng = response.routes[0].legs[0].end_location.lng;

        distance = ((response.routes[0].legs[0].distance.value) / 1609.34).toFixed(2);
        
        //USE AN IF CONDITIONAL FOR IF THIS FILEPATH DOESN'T EXIST, SET ONE. ELSE DON'T DO ANYTHING????
        database.ref(username + '/' + routeName).set({
            startPoint: origin,
            endPoint: destination,
            distanceTravelled: distance,
            timeTaken: 'tbd',
            avgSpeed : 'tbd',
        });
    });

    calcRoute();
});


function initialize() {
    directionsDisplay = new google.maps.DirectionsRenderer();
    var ucbe = new google.maps.LatLng(37.7918156, -122.3931774);
    var mapOptions = {
        zoom: 10,
        center: ucbe,
    }

    map = new google.maps.Map(document.getElementById('map-body'), mapOptions);
    directionsDisplay.setMap(map);
}

function calcRoute() {
  
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

$('#main-wrapper').hide();