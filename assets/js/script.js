
var APIkey = "949b5169e84da962b9543928a075f3b6"

var city = "Madison";

var cityURL = "https://api.openweathermap.org/geo/1.0/direct?q="+ city +"&limit=1&appid="+ APIkey

var lat;
var lon;


console.log(lat);


fetch (cityURL)
    .then(function(response) {
        return response.json()
    })
    .then(function(data) {
        console.log(data)
        var lat = data[0].lat;
        var lon = data[0].lon;
        var weatherURL = "https://api.openweathermap.org/data/2.5/onecall?lat="+ lat +"&lon="+ lon +"&exclude=minutely,hourly,daily&appid="+ APIkey
        console.log(weatherURL);
    });

// get coorinates of a city
// function getCoords(city) {

//     // fetch city coordinates
//     fetch(cityURL)
//     .then(function (response){
//         return response.json();
//     }).then(function(data){
//         if (data.length !== 0){
//             // set latitude and longitude
//             lat = data[0].lat;
//             lon = data[0].lon;
//             // create url to fetch
//             getWeatherInfo(weatherURL);
//         } else {
//             console.log("City not found");
//             // currentSection.querySelector(".current-header").innerHTML = "City Not Found";
//         }
//     }).catch(function(error){
//         console.log(error.message);
//     })

