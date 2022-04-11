var APIkey = "949b5169e84da962b9543928a075f3b6"

function getLocationData(city) {
    fetch("https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=" + APIkey)
        // console.log(cityURL)
        .then(function (response) {
            return response.json()
        })
        .then(function (cityData) {
            console.log(cityData);
            // var lat = data[0].lat;
            // var lon = data[0].lon;
        });
}

function getCurrentWeather(lat, lon) {
    fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + cityData[0].lat + "&lon=" + cityData[0].lon + "&exclude=minutely,hourly,daily&appid=" + APIkey + "&units=imperial")
        .then(function (response) {
            return response.json()
        })
        .then(function (weatherData) {
                console.log(weatherData);
        });

}


getLocationData('Madison')