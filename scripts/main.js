
function checkCoordValidity(lat,lon){
    if(lat <= 90 && lat >=-90 && lon<=180 && lon >= -180){
        return true;
    }
    else{
        return false;
    }
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
    const accessKey = 'b1811845a11ac779035d26e75bf40677';
    const latitude = lat;
    const longitude = lon; 
    const apiUrl = `http://api.weatherstack.com/current?access_key=${accessKey}&query=${latitude},${longitude}`;
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
    switch(data.current.weather_descriptions[0].toLowerCase()){
        case "sunny":
        case "clear":
            cssfile.href = "styles/sunny.css";
            break;
        case "cloudy":
        case "overcast":
            cssfile.href = "styles/cloudy.css";
            break;
        case "mist":
        case "fog":
            cssfile.href = "styles/mist.css";
            break;
        case "thunderstorm":
            cssfile.href = "styles/thunderstorm.css";
            break;
        case "rain":
            cssfile.href = "styles/rain.css";
            break;
        case "snow":
            cssfile.href = "styles/snow.css";
            break;
        default:
            cssfile.href = "styles/def.css";
            break;
    }
    
    const location = data.location.name;
    const country = data.location.country;
    const region = data.location.region;
    const lat = data.location.lat;
    const lon = data.location.lon;
    const localtime = data.location.localtime;
    const temp = data.current.temperature;
    const feelslike = data.current.feelslike;
    const description = data.current.weather_descriptions[0];
    
    const tempLabel = document.getElementById("realTempLabel");
    tempLabel.textContent = temp + "°C";

    const feelslikeLabel = document.getElementById("feelslikeTempLabel");
    feelslikeLabel.textContent = "Feels like: " + feelslike + "°C";
    document.head.appendChild(maincss);
    document.head.appendChild(cssfile);
}