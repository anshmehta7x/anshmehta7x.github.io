function handleSubmitClick(){
    const la = document.getElementById("latBox").value;
    const lo = document.getElementById("lonBox").value;
    updateCoords(la,lo)
}

function setCoordinates(){

    function errorcallback(){
        updateCoords("b","a");
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        updateCoords(latitude,longitude)
      },errorcallback);
    } else {
      updateCoords("a","b");
    }
  }

function updateCoords(la,lo){
    const laLabel = document.getElementById("latLabel");
    const loLabel = document.getElementById("lonLabel");
    const errorLabel = document.getElementById("errorLabel");
    if(la==="a"){
        errorLabel.textContent = "Browser doesnt support location data";
        laLabel.textContent = "";
        loLabel.textContent = "";
    }
    else if(la==="b"){
        errorLabel.textContent = "Cannot access location data";
        laLabel.textContent = "";
        loLabel.textContent = "";
    }

    else if(la <= 90 && la >=-90 && lo<=180 && lo >= -180){
        
        laLabel.textContent = "Latitude : " + la;
        loLabel.textContent = "Longitude : " + lo;
        errorLabel.textContent = "";
        getWeatherData(la,lo);
    }
    else{
        errorLabel.textContent = "Invalid Coordinates";
        laLabel.textContent = "";
        loLabel.textContent = "";
    }
}

function getWeatherData(lat,lon){
    const accessKey = 'b1811845a11ac779035d26e75bf40677';
    const latitude = lat;
    const longitude = lon; 
    const apiUrl = `http://api.weatherstack.com/current?access_key=${accessKey}&query=${latitude},${longitude}`;

    fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        // The weather data is available in the 'data' variable
        console.log(data);
    })
    .catch(error => {
        console.error(error);
    });
}

