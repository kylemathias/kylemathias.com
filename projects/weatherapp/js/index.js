/*global $, navigator,document*/

var lon;
var lat;
var icon;

function getInfoApi() {

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {

            lon = position.coords.longitude;
            lat = position.coords.latitude;

            requestWeather(lon, lat);

        });
    }

    function requestWeather(lon, lat) {
        lon = lon;
        lat = lat;
        $.ajax({
                type: 'GET',
                url: "https://fcc-weather-api.glitch.me/api/current",
                async: false,
                data: {
                    lon: lon,
                    lat: lat
                }
            })
            .done(function (data) {
                var nightTime = false;
                if (data.dt > data.sys.sunset) {
                    nightTime = true;
                }
                setWeatherIcon(data.weather[0].id, nightTime);
                setLocation(data.name, data.sys.country);
                setTempWeather(Math.round(data.main.temp), data.weather[0].main, "C");


            });
    }

}
getInfoApi();


//ID meaning found here https://openweathermap.org/weather-conditions#Weather-Condition-Codes-2
function setWeatherIcon(ID, nightTime) {

    switch (true) {
        //clouds
        case (ID >= 801):
            icon = 'cloudy';
            break;
            //clear sky day
        case (ID == 800 && nightTime === false):
            icon = 'sunny';
            break;
            //clear sky night
        case (ID == 800 && nightTime === true):
            icon = 'starry';
            break;
            //haze
        case (ID >= 700):
            icon = 'cloudy';
            break;
            //snow
        case (ID >= 600):
            icon = 'snowy';
            break;
            //rain
        case (ID >= 500):
            icon = 'rainy';
            break;
            //drizzle
        case (ID >= 300):
            icon = 'rainy';
            break;
            //thunder storms
        case (ID >= 200):
            icon = 'stormy';
            break;
            //anything that was counted
        case (ID >= 0):
            icon = 'rainbow';
            break;

    }
    document.getElementById("weatherIcon").classList.add(icon);
}


function setLocation(city, country) {
    document.getElementById("location").innerHTML = city + ", " + country;
}

function setTempWeather(temp, type, measurement) {
    if (measurement == "C") {
        temp = Math.round(temp * 1.8 + 32);
        measurement = "F";
    } else {
        if (measurement == "F") {
            temp = Math.round((temp - 32) / 1.8);
            measurement = "C";
        }
    }

    document.getElementById("tempWeather").innerHTML = type + ": " + temp + "° " + measurement;
    document.getElementById("tempWeather").onclick = function () {

        setTempWeather(temp, type, measurement);
    };

}
