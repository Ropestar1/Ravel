
$(document).ready(function () {
$("#submit").on("click", function(event){

 event.preventDefault();

 var destination = $("#destination").val().trim();
 var origin = $("#origin").val().trim();
 // var time = $("#time").val().trim();
  var queryURL = 
 // "https://cors-anywhere.herokuapp.com/"+"https://maps.googleapis.com/maps/api/directions/json?origin=" + origin + "&destination=" + destination + "&Mode=BICYCLING&key=AIzaSyA0oMhk60GOJSoK46J8f0dAwghkBwgThl0";

"https://cors-anywhere.herokuapp.com/"+"http://www.mapquestapi.com/directions/v2/route?key=KEY&from=" + origin + "&to="+ destination;




 // "https://maps.googleapis.com/maps/api/directions/json?&mode=BICYCLING&origin=sunnyvale&destination=cupertino&departure_time=" + time +  "&key=AIzaSyA0oMhk60GOJSoK46J8f0dAwghkBwgThl0"

  console.log(queryURL);
  $.ajax({
    url : queryURL,
    method : "GET",
    dataType : 'json'
   
 }).done(function(response){
 	// debugger;
   console.log(response);
   // $("#map").append(response);

})

});




});









