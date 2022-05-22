var APIkey = "949b5169e84da962b9543928a075f3b6"
let locations = [];


function getWeather(lat, lon, city) {

    var queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=,minutely,hourly,alerts&appid=" + APIkey;

    // this AJAX request gets the data from the open weathermap
    $.ajax({
        url: queryURL,
        method: "GET"
    })
        // the data is then stored in the .then statement and passed to the function showWeather
        .then(function (response) {

            showWeather(response, city);

        });           
 };


 // this function calls the weather API based on the zip code
function loadWeatherZip(zipCode, isClicked) {

    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?zip=" + zipCode + ",us&appid=" + APIkey;
    var weatherContainer = $("#weatherContainer");

    // this AJAX request gets the data from the open weathermap, like in the previous function
    $.ajax({
        url: queryURL,
        method: "GET"
    })
        // the data is then stored in the .then statement and passed to the function getWeather
        .then(function (response) { 

            if (!isClicked)
            {
                saveLocations(response);  //save the city and zip to local storage
                renderLocations();
            }


            //loads the relevant location data to call the weather
            getWeather(response.city.coord.lat, response.city.coord.lon, response.city.name);

        })
        //  and this catch returns an error message if the process goes wonky
        .catch(function (response){
            alert("Not a vaild Zip Code")
        });
}

 // this function calls the weather API based on the city
function loadWeatherCity(city, isClicked) {
    
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + ",us&appid=" + APIkey;
    var weatherContainer = $("#weatherContainer");

    // this AJAX request gets the data from the open weathermap, like in the previous function
    $.ajax({
        url: queryURL,
        method: "GET"
    })
        // the data is then stored in the .then statement and passed to the function getWeather
        .then(function (response) {

            console.log(response);

            if (!isClicked)
            {
                saveLocations(response);  //save the city to local storage
                renderLocations();
            }

            //loads the relevant location data to call the weather
            getWeather(response.city.coord.lat, response.city.coord.lon, response.city.name);

        })
        //  and this catch returns an error message if the process goes wonky
        .catch(function(response){
            alert("Not a valid City");
        });
}

//  this function loads the weather data
function showWeather(weatherData, city)
{
    // this vairable contains the relevant iconography contained in the openweather api for the current weather
    var iconURL = "http://openweathermap.org/img/w/" + weatherData.current.weather[0].icon + ".png"; 
    // this data gets passed into the current weather card to display the relevant icon associated with theapi
    $("#currentCard").html(city + " (" + new Date().toLocaleDateString() + ") <img id=\"icon\" src=\"" + iconURL  + "\" alt=\"Weather icon\"/>");

    // the temp variable gathers the temperature in Kelvin and math is applied to change it into Farenheit
    var temp = parseInt(weatherData.current.temp);
    temp = Math.round(((temp-273.15)*1.8) + 32);
    $("#currentTemp").html(" " + temp +  "  &degF");
    // while the humidity and wind speed are used directly from the api
    $("#currentHumidity").html(weatherData.current.humidity + "%");
    $("#currentWindSpeed").html(weatherData.current.wind_speed + " MPH");

    //get the current uv index and store in the uvIndex.current array 
    var uvIndex = weatherData.current.uvi;

    var bgColor = "";  //holds the background color for UV Index
    var textColor = "";  //holds the text color for UV Index

    if (uvIndex < 3) //if uv index is low (1-2)
    {
        bgColor = "bg-success";
        textColor = "text-light";  
    }
    else if (uvIndex > 2 && uvIndex < 6)  //if uv index is mocerate (3-5)
    {
        bgColor = "bg-warning";
        textColor = "text-dark";             
    }
    else  //if uv index is high (6+)
    {
        bgColor = "bg-danger";
        textColor = "text-light";            
    }

    $("#currentUVIndex").html(uvIndex).addClass(bgColor + " p-1 " +  textColor); //set the UVIndex and color to the html


    //load 5 Day
    var ul5 = $("#fiveDay");
    ul5.empty();

    for (i=1; i < 6; i++)  //we want the days 1-5
    {
        //make the elements to display the 5 day forecast and append to the parent div
        var div = $("<div>").addClass("bg-primary");

        var dateTime = parseInt(weatherData.daily[i].dt); 
        var dateHeading = $("<h6>").text(new Date(dateTime * 1000).toLocaleDateString());  //convert unix time to javascript date
        var iconDayURL = "http://openweathermap.org/img/w/" + weatherData.daily[i].weather[0].icon + ".png";  //get weather icon
        var icon = $("<img>").attr("src", iconDayURL);

        temp = parseInt(weatherData.daily[i].temp.day);  //convert kelvin to Fahrenheit
        temp = Math.round(((temp-273.15)*1.8) + 32);  //convert kelvin to Fahrenheit
        var temp5 = $("<p>").html("Temp: " + temp +  "  &degF");

        var humidity5 = $("<p>").html("Humidity: " + weatherData.daily[i].humidity + "%");

        div.append(dateHeading);
        div.append(icon);
        div.append(temp5);
        div.append(humidity5);
        ul5.append(div);

    }

    $("#weatherData").show();
}

//load locations from local storage to the locations array
function loadLocations()
{
    var locationsArray = localStorage.getItem("locations");
    if (locationsArray) //if not undefined
    {
      locations = JSON.parse(locationsArray);  //make sure there is a locations object in local storage
      renderLocations();
    }
    else {
      localStorage.setItem("locations", JSON.stringify(locations));  //if not make one and store it to local storage
    }
}

function renderLocations()
{
    var divLocations = $("#locationHistory");
    divLocations.empty();  //clear the cities list before rendering it from the local storage object

    $.each(locations, function(index, item){
        var a = $("<a>").addClass("list-group-item list-group-item-action city").attr("data-city", locations[index]).text(locations[index]);
        divLocations.append(a);
    });

    $("#locationHistory > a").off();

    $("#locationHistory > a").click(function (event)
    {   
        var element = event.target;
        var city = $(element).attr("data-city");

        loadWeatherCity(city, true);
    });

}

//save locations to the locations array and local storage
function saveLocations(data)
{

    var city = data.city.name; //get the city came

    locations.unshift(city);
    localStorage.setItem("locations", JSON.stringify(locations));  //convert to a string and sent to local storage

}

$(document).ready(function () {

    $("#weatherData").hide();  //Hide the div that will show all the weather data and we will show it once it is populated

    loadLocations();  //get the locations from local storage and load them to the locations array

    $("#searchBtn").click(function (event) {  //event handler for the city search input
        var element = event.target; //set element to the div that was clicked
        var searchCriteria = $("#zipCode").val();  //get the user input
        
        if (searchCriteria !== "")  //make sure it is not empty
        {
            var zip = parseInt(searchCriteria); //is it a zip code or city name

            if (!isNaN(zip)) //yes it is a zip code
            {
                loadWeatherZip(zip, false);
            }
            else
            {
                loadWeatherCity(searchCriteria, false);  //no, it is a city name
            }
        }
    });
});