var zipcode = 94568 //this will be an input through googlemaps 
    var queryURL = "http://api.wunderground.com/api/f865102da28852b3/conditions/q/" + zipcode + ".json";

    $.ajax({
      url: queryURL,
      method: "GET"
    }).done(function(response) {
      var localTemp = response.current_observation.temperature_string;
      var tempIcon = response.current_observation.icon_url;
      console.log(response);
      console.log("localTemp",localTemp);
      

      $('#weather').html(localTemp);
      $('#weather').append('<img src='+ tempIcon + '>')
    });