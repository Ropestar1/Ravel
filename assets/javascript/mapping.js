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
    userList = Object.keys(snapshot.val());

	// If any errors are experienced, log them to console.
	}, function(errorObject) {
		console.log("The read failed: " + errorObject.code);
});

$('#new-user').on('click', function(event){

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
        
        initialize();
    }
});

$('#login').on('click', function(event){
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
        $('#hidden-form').show();
        initialize();
        
        return database.ref(username).orderByKey().once('value').then(function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                var childData = childSnapshot.val();
                console.log(childData);

                var fbStart = childData.startPoint;
                var fbEnd = childData.endPoint;
                var fbRouteName = childSnapshot.key;
                var fbDistTrav = childData.distanceTravelled;
                var fbAvgSpeed = childData.avgSpeed;
                var fbTime = childData.timeTaken;
                // var timeRecord =
                //     '<td><input type="text" id="time-input"><button type="button" id="time-rec">o</button></td>';
                $('#user-stats').append('<tr id="' + fbRouteName + '"></tr>');
                $('#' + fbRouteName).append('<td>' + fbStart + '</td>');
                $('#' + fbRouteName).append('<td>' + fbEnd + '</td>');
                $('#' + fbRouteName).append('<td>' + fbRouteName + '</td>');
                $('#' + fbRouteName).append('<td id="temp-distance">' + fbDistTrav + '</td>');
                $('#' + fbRouteName).append('<td id="swap-speed" data-temp="present">' + fbAvgSpeed + '</td>');
                $('#' + fbRouteName).append('<td id="time-hold" data-temp="true">' + fbTime + '</td>');

                // if (fbTime === 'tbd') {
                //     $('#' + fbRouteName).append('<td>' + fbStart + '</td>');
                //     $('#' + fbRouteName).append('<td>' + fbEnd + '</td>');
                //     $('#' + fbRouteName).append('<td>' + fbRouteName + '</td>');
                //     $('#' + fbRouteName).append('<td id="temp-distance">' + fbDistTrav + '</td>');
                //     $('#' + fbRouteName).append('<td id="swap-speed">' + fbAvgSpeed + '</td>');
                //     $('#' + fbRouteName).append(timeRecord);
                // }
                // else {
                //     $('#' + fbRouteName).append('<td>' + fbStart + '</td>');
                //     $('#' + fbRouteName).append('<td>' + fbEnd + '</td>');
                //     $('#' + fbRouteName).append('<td>' + fbRouteName + '</td>');
                //     $('#' + fbRouteName).append('<td>' + fbDistTrav + '</td>');
                //     $('#' + fbRouteName).append('<td>' + fbAvgSpeed + '</td>');
                //     $('#' + fbRouteName).append('<td>' + fbTime + '</td>');
                // }
            });
        });    
    }
});

$("#submit").on("click", function(event){
    event.preventDefault();
    
    routeName = $("#route-name").val().trim();
    origin = $("#origin").val().trim();
    destination = $("#destination").val().trim();
   
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

$('#time-rec').on("click", function(event){
    event.preventDefault();
    
    console.log('clicked');
    var minutes = parseInt($('#time-input').val());
    var distValue = parseInt($('#temp-distance').text());
    var speedDisplay = ((distValue / minutes) * 60).toFixed(0);

    $('#swap-speed').html('<td>' + speedDisplay + '</td>'); //find way to target just the data-value attribute
    $('#swap-speed').removeAttr('data-value');

    $('#time-hold').html('<td>' + minutes + '</td>'); //find way to target just the data-value attribute
    $('#time-hold').removeAttr('data-value');
    
    // database.ref(username + '/' + routeName).update({
    //     timeTaken: minutes,
    //     avgSpeed : speedDisplay,
    // });
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
$('#hidden-form').hide();