function checkCoordValidity(lat,lon){
    if(lat <= 90 && lat >=-90 && lon<=180 && lon >= -180){
        return true;
    }
    else{
        return false;
    }
}

function coordString(lat,lon){

    if(lat<0){
        var la = lat*-1;
        var la_s = la.toString();
        la_s = la_s +" S";
    }
    else{
        var la_s = lat.toString();
        la_s = la_s +" N";
    }

    if(lon<0){
        var lo = lon*-1;
        var lo_s = lo.toString();
        lo_s = lo_s +" W";
    }
    else{
        var lo_s = lon.toString();
        lo_s = lo_s +" E";
    }
    let retString = la_s + " , " + lo_s;
    return retString;
}

function handleSubmitClick(){
    const la = document.getElementById("latInput").value;
    const lo = document.getElementById("lonInput").value;
    let la_f = parseFloat(la) + 0.000001;
    let lo_f = parseFloat(lo) + 0.000001;
    if(checkCoordValidity(la_f,lo_f)){
        getWeatherData(la_f,lo_f);
    }
    else{
        const err = document.getElementById("errorLabel1");
        err.textContent = "Invalid Coordinates";
    }
}

function handleAutoClick(){

    function errorCallback(){
        const err = document.getElementById("errorLabel2");
        err.textContent = "Geolocation permission not available";
    }

    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(function(position){
            getWeatherData(position.coords.latitude,position.coords.longitude);
        },errorCallback);
    }
    else{
        const err = document.getElementById("errorLabel2");
        err.textContent = "Geolocation not supported";
    }
}

function getWeatherData(lat,lon){
    const accessKey = '2154cbdd26d3416a93874652231304';
    const latitude = lat;
    const longitude = lon; 
    const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${accessKey}&q=${latitude},${longitude}`;
    console.log(apiUrl);
    fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        // The weather data is available in the 'data' variable
        const weatherData = data;
        console.log(weatherData)
        createOutputPage(weatherData);
    })
    .catch(error => {
        console.error(error);
    });
    
}

function createOutputPage(data){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'landing.html', true);
  
    xhr.onload = function() {
      if (xhr.status === 200) {
        // Replace the contents of the current page with the contents of the new page
        document.open();
        document.write(xhr.responseText);
        document.close();
        // Access an element on the new page and modify it
        document.addEventListener("DOMContentLoaded", function() {
            // Your code to access the element here
            edit(data);
          });
      }
    };
    xhr.send();
}

function edit(data){
    const maincss = document.createElement("link");
    maincss.rel = "stylesheet";
    maincss.type = "text/css";
    maincss.href = "styles/landing.css";
    const cssfile = document.createElement("link");
    cssfile.rel = "stylesheet";
    cssfile.type = "text/css";
    const desc = data.current.condition.text.toLowerCase();
    const cssFiles = {
        "sunny": "styles/sunny.css",
        "clear": "styles/clear.css",
        "partly cloudy": "styles/cloudy.css",
        "cloudy": "styles/cloudy.css",
        "overcast": "styles/cloudy.css",
        "mist": "styles/mist.css",
        "fog": "styles/mist.css",
        "freezing fog": "styles/mist.css",
        "thunderstorm": "styles/thunderstorm.css",
        "thundery outbreaks possible": "styles/thunderstorm.css",
        "patchy light rain with thunder": "styles/thunderstorm.css",
        "moderate or heavy rain with thunder": "styles/thunderstorm.css",
        "patchy light snow with thunder": "styles/thunderstorm.css",
        "modern or heavy snow with thunder": "styles/thunderstorm.css",
        "rain": "styles/rain.css",
        "patchy rain possible": "styles/rain.css",
        "patchy freezing drizzle possible": "styles/rain.css",
        "patchy light drizzle": "styles/rain.css",
        "light drizzle": "styles/rain.css",
        "freezing drizzle": "styles/rain.css",
        "heavy freezing drizzle": "styles/rain.css",
        "patchy light rain": "styles/rain.css",
        "light rain": "styles/rain.css",
        "moderate rain at times": "styles/rain.css",
        "moderate rain": "styles/rain.css",
        "heavy rain at times": "styles/rain.css",
        "heavy rain": "styles/rain.css",
        "light freezing rain": "styles/rain.css",
        "light rain shower": "styles/rain.css",
        "moderate or heavy rain shower": "styles/rain.css",
        "torrential rain shower": "styles/rain.css",
        "light sleet showers": "styles/rain.css",
        "moderate or heavy sleet showers": "styles/rain.css",
        "moderate or heavy freezing rain": "styles/rain.css",
        "light sleet": "styles/snow.css",
        "moderate or heavy sleet": "styles/snow.css",
        "patchy light snow": "styles/snow.css",
        "light snow": "styles/snow.css",
        "light snow showers": "styles/snow.css",
        "moderate or heavy snow showers": "styles/snow.css",
        "light showers of ice pellets": "styles/snow.css",
        "patchy moderate snow": "styles/snow.css",
        "moderate snow": "styles/snow.css",
        "patchy heavy snow": "styles/snow.css",
        "heavy snow": "styles/snow.css",
        "ice pellets": "styles/snow.css",
        "patchy snow possible": "styles/snow.css",
        "blizzard": "styles/snow.css",
        "blowing snow": "styles/snow.css",
        "snow": "styles/snow.css",
        "patchy sleet possible": "styles/snow.css",
        "default": "styles/def.css"
      };
    cssfile.href = cssFiles[desc] || cssFiles["default"];
    const location = data.location.name;
    const country = data.location.country;
    const region = data.location.region;
    const lat = data.location.lat;
    const lon = data.location.lon;
    const localtime = data.location.localtime;
    const temp = data.current.temp_c;
    const feelslike = data.current.feelslike_c;
    const description = data.current.condition.text;
    
    const tempLabel = document.getElementById("realTempLabel");
    tempLabel.textContent = temp + "°C";

    const feelslikeLabel = document.getElementById("feelslikeTempLabel");
    feelslikeLabel.textContent = "Feels like: " + feelslike + "°C";

    const descriptionLabel = document.getElementById("weatherDescription");
    descriptionLabel.textContent = description;

    const locationLabel = document.getElementById("locationLabel");
    locationLabel.textContent = location + ", " + region + ", " + country;

    const latlonLabel = document.getElementById("latlonLabel");
    latlonLabel.textContent = coordString(lat,lon);

    const localTime = document.getElementById("localTimeLabel");
    localTime.textContent = localtime;

    document.head.appendChild(maincss);
    document.head.appendChild(cssfile);
}