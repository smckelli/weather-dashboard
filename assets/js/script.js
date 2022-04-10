var APIkey = "949b5169e84da962b9543928a075f3b6"

function getLocationData(city) {
    fetch("https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=" + APIkey)
        // console.log(cityURL)
        .then(function (response) {
            return response.json()
        })
        .then(function (locationData) {
            console.log(locationData);
            getCurrentWeather(locationData[0].lat, locationData[0].lon)
            // var lat = data[0].lat;
            // var lon = data[0].lon;
        });
}

function getCurrentWeather(lat, lon) {
    fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly,daily&appid=" + APIkey + "&units=imperial")
        .then(function (response) {
            return response.json()
        })
        .then(function (weatherData) {
                console.log(weatherData);
        });

}


getLocationData('Madison')