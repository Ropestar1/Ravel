$(document).ready(function () {
$("#submit").on("click", function(event){

 event.preventDefault();

 var destination = $("#destination").val().trim();
 var origin = $("#origin").val().trim();
  var queryURL = 
 "https://cors-anywhere.herokuapp.com/"+
 "https://maps.googleapis.com/maps/api/elevation/json?locations=39.7391536,-104.9847034&key=AIzaSyA0oMhk60GOJSoK46J8f0dAwghkBwgThl0";

  console.log(queryURL);
  $.ajax({
    url : queryURL,
    method : "GET",
    dataType : 'json'
   

 }).done(function(elevationData){
     debugger;
   console.log(elevationData);

})

});




});

