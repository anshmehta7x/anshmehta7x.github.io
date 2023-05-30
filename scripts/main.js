const cssFiles = {
    "sunny": "../../styles/sunny.css",
    "clear": "../styles/clear.css",
    "partly cloudy": "../styles/cloudy.css",
    "cloudy": "../styles/cloudy.css",
    "overcast": "../styles/cloudy.css",
    "mist": "../styles/mist.css",
    "fog": "../styles/mist.css",
    "freezing fog": "../styles/mist.css",
    "thunderstorm": "../styles/thunderstorm.css",
    "thundery outbreaks possible": "../styles/thunderstorm.css",
    "patchy light rain with thunder": "../styles/thunderstorm.css",
    "moderate or heavy rain with thunder": "../styles/thunderstorm.css",
    "patchy light snow with thunder": "../styles/thunderstorm.css",
    "modern or heavy snow with thunder": "../styles/thunderstorm.css",
    "rain": "../styles/rain.css",
    "patchy rain possible": "../styles/rain.css",
    "patchy freezing drizzle possible": "../styles/rain.css",
    "patchy light drizzle": "../styles/rain.css",
    "light drizzle": "../styles/rain.css",
    "freezing drizzle": "../styles/rain.css",
    "heavy freezing drizzle": "../styles/rain.css",
    "patchy light rain": "../styles/rain.css",
    "light rain": "../styles/rain.css",
    "moderate rain at times": "../styles/rain.css",
    "moderate rain": "../styles/rain.css",
    "heavy rain at times": "../styles/rain.css",
    "heavy rain": "../styles/rain.css",
    "light freezing rain": "../styles/rain.css",
    "light rain shower": "../styles/rain.css",
    "moderate or heavy rain shower": "../styles/rain.css",
    "torrential rain shower": "../styles/rain.css",
    "light sleet showers": "../styles/rain.css",
    "moderate or heavy sleet showers": "../styles/rain.css",
    "moderate or heavy freezing rain": "../styles/rain.css",
    "light sleet": "../styles/snow.css",
    "moderate or heavy sleet": "../styles/snow.css",
    "patchy light snow": "../styles/snow.css",
    "light snow": "../styles/snow.css",
    "light snow showers": "../styles/snow.css",
    "moderate or heavy snow showers": "../styles/snow.css",
    "light showers of ice pellets": "../styles/snow.css",
    "patchy moderate snow": "../styles/snow.css",
    "moderate snow": "../styles/snow.css",
    "patchy heavy snow": "../styles/snow.css",
    "heavy snow": "../styles/snow.css",
    "ice pellets": "../styles/snow.css",
    "patchy snow possible": "../styles/snow.css",
    "blizzard": "../styles/snow.css",
    "blowing snow": "../styles/snow.css",
    "snow": "../styles/snow.css",
    "patchy sleet possible": "../styles/snow.css",
    "default": "../styles/def.css"
  };

class Weather{
    constructor(dataObj){
        this.description = dataObj.current.condition.text.toLowerCase();
        this.temp_c = dataObj.current.temp_c;
        this.temp_f = dataObj.current.temp_f;
        this.feelslike_c = dataObj.current.feelslike_c;

        this.country = dataObj.location.country;
        this.city = dataObj.location.name;
        this.region = dataObj.location.region;
        this.lat = dataObj.location.lat;
        this.lon = dataObj.location.lon;

    }

    setCss(){
        this.cssfile = document.createElement("link");
        this.cssfile.rel = "stylesheet";
        this.cssfile.type = "text/css";
        this.cssfile.href = cssFiles[this.description] || cssFiles["default"];
        document.head.appendChild(this.cssfile);
        console.log(document);
    }
}

let input = document.querySelector("input");
var cities = [];
window.addEventListener("load", function(){
    console.log("Page Loaded");
    fetch('../scripts/cities.json')
    .then(response => response.json())
    .then(data => {
        cities = data;
    });

});
const accessKey = '2154cbdd26d3416a93874652231304';
var cityInput;
var cityList;
var autoButton;
var searchButton;
document.addEventListener("DOMContentLoaded", function() {
    cityInput = document.getElementById("cityInput");
    cityInput.addEventListener("input",suggestedCities);
    cityList = document.getElementById("cityList");
    autoButton = document.getElementById("autoButton");
    autoButton.addEventListener("click",handleAutoClick);
    searchButton = document.getElementById("searchButton");
    searchButton.addEventListener("click",handleSearchClick);
});


function suggestedCities(d){
    var count = 0;
    const text = d.target.value;
    while (cityList.firstChild) {
        cityList.removeChild(cityList.firstChild);
      }
    
    if(text.length == 0){
        return;
    }
    
    cities.forEach(element => {
        if (count <= 4 && element.name.toLowerCase().startsWith(text.toLowerCase())) {
            const option = document.createElement('option');
            option.value = element.name;
            cityList.appendChild(option);
            count++;
        } 
    });
}

function handleAutoClick() {
    function errorCallback() {
      const err = document.getElementById("errorLabel");
      err.textContent = "Geolocation permission not available";
    }
  
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        getWeatherData(position.coords.latitude, position.coords.longitude);
      }, errorCallback);
    } else {
      const err = document.getElementById("errorLabel");
      err.textContent = "Geolocation not supported";
    }
  
    function getWeatherData(lat, lon) {
      const latitude = lat;
      const longitude = lon;
      const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${accessKey}&q=${latitude},${longitude}`;
      console.log(apiUrl);
      fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
          const weatherData = data;
          const wData = new Weather(weatherData);
          console.log(wData);
          createOutputPage(wData);
        })
        .catch(error => {
          console.error(error);
        });
    }
  }  

function handleSearchClick(){
    const cityName = cityInput.value;
    const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${accessKey}&q=${cityName}`;
    fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        const weatherData = data;
        if(Object.keys(data)[0] == 'error'){
            const err = document.getElementById("errorLabel");
            err.textContent = "City not found";    
            return;
        }
        const wData = new Weather(weatherData);
        console.log(wData);
        createOutputPage(wData);
    })
    .catch(error => {
        console.error(error);
    });
}

function createOutputPage(weatherDataObject){
    window.location.href = "landing.html";


    // NEED TO USE QUERY PARAMETER TO PASS DATA TO LANDING PAGE
    weatherDataObject.setCss();
}