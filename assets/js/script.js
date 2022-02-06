var cityEl = document.getElementById("city");
var cityNameEl = document.getElementById("city-name")
var inputEl = document.getElementById("city-search");
var lat = "";
var lon = "";
var inputFormEl = document.getElementById("input-form");
var city = "";
var today = moment().format('l');
var forecastContainerEl = document.getElementById("forecast-container");
var priorSearches = [];
var priorSearchesEl = document.getElementById("prior-searches")


// Displays the Current Weather Data for the Selected City
var displayCurrentWeather = function (data) {
    cityNameEl.textContent = city + " (" + today + ") ";
    var iconcode = data.current.weather[0].icon;
    var iconUrl = "http://openweathermap.org/img/w/" + iconcode + ".png";
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
    // calls the function to display the forecast for the current city
    displayPriorSearches();
}

// Displays the forecast for the current city
var displayForcast = function (data) {
    forecastContainerEl.textContent = "";
    for (var i = 0; i < 5; i++) {
        var forecastEl = document.createElement("div");
        forecastEl.className += "col forecast";
        if (i < 4) {
            forecastEl.className += " mr-3";
        }
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

        // Appends the forecast for the particular date to the container for the 5-day forecast

        forecastContainerEl.appendChild(forecastEl);
    }

}

// Obtains the coodfinates using an API for the selected city and then send those coordinates as arguments to another function to get the weather data for that city
var coordinates = function (event) {
    event.preventDefault();
    city = inputEl.value.trim();
    if (!city) {
        return;
    }


    var apiUrlGeoCode = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=0f495242c82beba70a7e55f7073bedf1";
    fetch(apiUrlGeoCode)
        .then(function (response) {
            if (response.ok) {
                loadSearches();
                if (!priorSearches.includes(city)) {
                    priorSearches.unshift(city);
                }
                saveSearches();
                response.json()
                    .then(function (data) {
                        if (data.length !== 0) {
                            lat = data.coord.lat;
                            lon = data.coord.lon;
                            getWeatherData(lat, lon);
                        }

                    });
            } else {
                alert("Incorrect City Name, Try again");
            }
        })
        .catch(function (err) {
            console.log("error: " + err);
        })
    // resets the value of the search input
    inputEl.value = "";

};


// Loads the prior searches from local storage into the priorSearches variable
var loadSearches = function () {
    priorSearches = JSON.parse(localStorage.getItem("priorSearches") || "[]");
    if (priorSearches == null) { priorSearches = [] };
    // Limits search history to 8 hits
    if (priorSearches.length > 8) {
        priorSearches.pop();
    }
};

// Saves prior search data to local storage
var saveSearches = function () {
    localStorage.setItem("priorSearches", JSON.stringify(priorSearches));
}

// Displays the prior searches as buttons underneath the search form
var displayPriorSearches = function () {
    loadSearches();
    priorSearchesEl.textContent = "";
    for (var i = 0; i < priorSearches.length; i++) {
        var searchBtn = document.createElement("button");
        searchBtn.className += "btn-block prior-search-btn upper-case";
        searchBtn.setAttribute("type", "button");
        searchBtn.setAttribute("data-city", priorSearches[i]);
        searchBtn.textContent = priorSearches[i];
        priorSearchesEl.appendChild(searchBtn);
    };
}

// This is called when user clicks on prior search button.  This function causes the weather data to display for the prior-searched city.
var searchBtnHandler = function (event) {
    inputEl.value = event.target.textContent;
    coordinates(event);
}
// Obtains weather data for the city using coordinates obtained from another search.
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

// calls the function to display the forecast for the current city
displayPriorSearches();

// listens for the user's city input in the search bar
inputFormEl.addEventListener("submit", coordinates);

// listens for the user to click a search history button
priorSearchesEl.addEventListener("click", searchBtnHandler)
