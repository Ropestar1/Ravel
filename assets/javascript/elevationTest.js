
$( document ).ready(function() {
    


// starting coordinates
var origin;
var startLat;
var startLng;

// ending coordinates
var destination;
var endLat;
var endLng;

//variables for elevation
var elSvc;
var columnchart;
var polyline;
var path = new Array();

//Load the visualization API and the columnchart package.

	//google.load("visualization", "1", {packages:["columnchart"] });

   function loadApi() {
  google.load("visualization", "1", {packages:["columnchart"]} );
  google.setOnLoadCallback(plotElevation);

}

// google documentation had these added
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var map;

// when submit button is clicked
$("#submit").on("click", function(event){
	event.preventDefault();



	// Creates an area to put the googlemaps results
	$('div.map-results-area').html('<div class="panel panel-primary" id="map-header-holder"></div>');
	$('#map-header-holder').html('<div class="panel-heading panel-heading-ravel" id="map-header-text"></div>');
	$('#map-header-text').html('<h3 class="panel-title"><strong> Map Routes </strong></h3>');

	$('#map-header-holder').append('<div class="panel-body" id="map-body"></div>');

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

		// $("#map").append(response);
		initialize();
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


	//Create a new chart in the elevation_chart DIV

	
    columnchart = new google.visualization.ColumnChart(document.getElementById('elevation_chart'));
 
    //Create an ElevationService
    elSvc = new google.maps.ElevationService();

    google.maps.event.addListner(map, 'click', function(event){
    	plotPoints(event.latLng);
    });

    google.maps.event.addListner(map, 'rightclick', function(event){
    	plottingComplete(event.latLng);
    });
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
}

function plotPoints(theLatLng){
	path.push(theLatLng);

	//display the markers
	marker = new google.maps.Marker({
		position: theLatLng,
		map : map
	});

}

function plottingComplete(theLatLng){
	path.push(theLatLng);

	//display the final marker
	marker = new google.maps.Marker({
		position : theLatLng,
		map : map
	});

	//Display a polyline of the elevation path
	var pathOptions = {
		path: path,
		strokeColor: '#OOOOCC',
		opacity: 0.4,
		map: map
	}
	polyline = new google.maps.Polyline(pathOptions);

	//the elevation service request
	var pathRequest ={
		'path': path,
		'samples': 256
	}
	eleSvc.getElevationAlongPath(pathRequest, plotElevation);
}

  function plotElevation(results, status){
  	if(status == google.maps.ElevationStatus.OK){
  		elevations = results;
  		var data = new google.visualization.DataTable();
  		data.addColumn('string', 'sample');
  		data.addColumn('number', 'Elevation');
  		for(var i=0; i<results.length; i++){
  			data.addRow(['', elevations[i].elevation]);
  		}

  		//Draw the chart using the data within its DIV.
  		document.getElementById('elevation_chart').style.display = 'block';
  		chart.draw(data, {
  			width:640,
  			height: 200,
  			legend: 'none',
  			titleY: 'Elevation (m)'
  		});
  	}
  }
 });