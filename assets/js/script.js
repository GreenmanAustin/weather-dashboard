var cityEl = document.getElementById("city");
var cityNameEl = document.getElementById("city-name")
var inputEl = document.getElementById("city-search");
var lat = "";
var lon = "";
var inputFormEl = document.getElementById("input-form");
var city = "";
var today = moment().format('l');
// var iconEl = document.getElementById("icon");



var displayCurrentWeather = function (data) {
    cityNameEl.textContent = city + " (" + today + ") ";
    console.log(data);
    var iconcode = data.current.weather[0].icon;
    console.log(iconcode);
    var iconUrl = "http://openweathermap.org/img/w/" + iconcode + ".png";
    console.log(iconUrl);
    var iconEl = document.createElement("img");
    iconEl.setAttribute("src", iconUrl);
    cityNameEl.appendChild(iconEl);
    var currentTempEl = document.getElementById("current-temp");
    currentTempEl.textContent = "Temp: " + data.current.temp + "\u00b0 F";
    var currentWindEl = document.getElementById("current-wind");
    currentWindEl.textContent = "Wind: " + data.current.wind_speed + " MPH";
    var currentHumidityEl = document.getElementById("current-hudmidity");
    currentHumidityEl.textContent = "Humidity: " + data.current.humidity + " %";
    var uv = document.getElementById("uv");
    uv.textContent = data.current.uvi;
}

var displayForcast = function (data) {
    for (var i = 0; i < 5; i++) {
        var forecastEl = document.getElementById("forecast-" + (i + 1));
        var day = document.createElement("div");
        day.className = "forecast-day";
        var newDate = moment().add(i + 1, 'days');
        newDate = moment(newDate).format('l');
        day.textContent = newDate;
        forecastEl.appendChild(day);

        // Add Icon
        var forecastIcon = document.createElement("img");
        forecastIcon.className = "forecast-icon";
        forecastIcon.setAttribute("src", "http://openweathermap.org/img/w/" + data.daily[i].weather[0].icon + ".png");
        forecastEl.appendChild(forecastIcon);

        // Add Temp
        var forecastTemp = document.createElement("div");
        forecastTemp.className = "forecast-info";
        forecastTemp.textContent = "Temp: " + data.daily[i].temp.day + " \u00b0 F";
        forecastEl.appendChild(forecastTemp);

        // Add Wind
        var forecastWind = document.createElement("div");
        forecastWind.className = "forecast-info";
        forecastWind.textContent = "Wind: " + data.daily[i].wind_speed + " MPH";
        forecastEl.appendChild(forecastWind);

        // Add Humidity
        var forecastHumidity = document.createElement("div");
        forecastHumidity.className = "forecast-info";
        forecastHumidity.textContent = "Humidity: " + data.daily[i].humidity + " %";
        forecastEl.appendChild(forecastHumidity);









    }

}


var coordinates = function (event) {
    event.preventDefault();
    console.log(today);
    city = inputEl.value.trim();
    var apiUrlGeoCode = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=0f495242c82beba70a7e55f7073bedf1";
    fetch(apiUrlGeoCode)
        .then(function (response) {
            if (response.ok) {
                response.json()
                    .then(function (data) {
                        if (data.length !== 0) {
                            lat = data.coord.lat;
                            lon = data.coord.lon;
                            getWeatherData(lat, lon);
                        }

                    });
            }
        })
        .catch(function (err) {
            console.log("error: " + err);
        })
};

var getWeatherData = function (lat, lon) {
    var apiUrlWeather = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=hourly,minutely,alerts&units=imperial&appid=0f495242c82beba70a7e55f7073bedf1"
    fetch(apiUrlWeather)
        .then(function (response) {
            if (response.ok) {
                response.json()
                    .then(function (data) {
                        if (data.length !== 0) {
                            displayCurrentWeather(data);
                            displayForcast(data);
                        }

                    });
            }
        })
        .catch(function (err) {
            console.log("error: " + err);
        })
};

var printCity = function (event) {
    event.preventDefault();
    var city = inputEl.value.trim();
    console.log(city);
}

inputFormEl.addEventListener("submit", coordinates);