'use strict';

const geo = navigator.geolocation;

settingUsersCurrentLocation();

function settingUsersCurrentLocation () {
    geo.getCurrentPosition((position) => {
        let userLat = position.coords.latitude;
        let userLng = position.coords.longitude;

        let coordinates = {
            lng: position.coords.longitude,
            lat: position.coords.latitude
        }

        map.setCenter([userLng, userLat]);
        createMarker(userLng, userLat);

        reverseGeocode(coordinates, MAPBOXGL_ACCESS_TOKEN).then(function (result){
            getLocationData(userLat,userLng, result);
        });



    });
}

function appendWeatherData(data, locationArray) {
    // console.log(data.current)
    let weatherBox = $('.weather-box');
    let currentDayBox = $('.current-day-box');

    // console.log(data.daily[0].temp.min)
    // console.log(data.daily[0].temp.max)
    // console.log(data.current.temp)


    currentDayBox.html('');
    currentDayBox.html
    (`
                <div class="card mt-3 mx-2">
                    <div class="card-header">
                        <span>${locationArray}</span>
                    </div>
                    <div class="card-body">
    
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <div class="bigger-text">${data.current.temp.toFixed(0)}&#176;</div>
                                    <div class="smaller-text">${data.current.weather[0].description}</div>
                                    <div class="smaller-text">Feels like ${data.current.feels_like.toFixed(0)}&#176; Humidity ${data.current.humidity}%</div>
                                </div>
                                
                                <div class="line-container">
                                    <div class="point offset-${getPercentage(data.daily[0].temp.min, data.daily[0].temp.max, data.current.temp)}">
                    
                                    </div>
                                </div>
                                
                                <div>
                                    <img src="http://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png"  alt="icon">
                                    <div class="smaller-text  text-center">${getSearchedTime(data.timezone_offset)}</div>
                                </div>
                            </div>
                    </div>
                <div class="card-header">
                    <a href="https://openweathermap.org/" target="_blank"><button class="btn">Open weather map</button></a>
                </div>
            </div>
    `)


    console.log(data)
    weatherBox.html('');
    for (let i = 0; i < data.daily.length; i++) {
        let dayAverage = (data.daily[i].temp.day + data.daily[i].temp.eve + data.daily[i].temp.morn + data.daily[i].temp.night) / 4;

        weatherBox.append
        (`
            <div class="weekly-containers d-flex justify-content-around align-items-center mb-1">
                <div>
                    <img src="http://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}@2x.png"  alt="icon">
                </div>
                
                <div class="line-container">
                    <div class="point offset-${getPercentage(data.daily[i].temp.min, data.daily[i].temp.max, dayAverage)}">
                    
                    </div>
                </div>
                
                <div>
                    ${getDayOfWeek(getDate(data.daily[i].dt).getDay())}
                </div>
                <div><span class="mr-2">Low: ${data.daily[i].temp.min.toFixed(0)}&#176;</span> High: ${data.daily[i].temp.max.toFixed(0)}&#176;</div>
            </div> 
        `)
    }

    weatherBox.append
    (`
                            <div class="col-12 d-flex justify-content-between align-items-center text-center ">
                                <div class="col-4">
                                    <a href="https://github.com/withers56" target="_blank"><i class="bi bi-github"></i></i></a>
                                </div>
                                <div class="col-4">
                                    <a href="https://openweathermap.org/" target="_blank"><i class="bi bi-brightness-high"></i></a>
                                </div>
                                <div class="col-4">
                                    <a href="https://www.mapbox.com/" target="_blank"><i class="bi bi-map"></i></a>
                                </div>
                            </div>
    `)

    weatherBox.children().each(function(index) {
        if (index % 2 !== 0) {
            $(this).css('background-color', 'rgb(179,179,179)');
        }
    });

}

function getLocationData (lat, long, locationArray) {
    $.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minutely&appid=${OPEN_WEATHER_MAP_KEY}`, {
        units: "imperial"
    }).done(function(data) {
        appendWeatherData(data, locationArray)
    });
}

function getDayOfWeek (day) {

    if (day === 0)
        return 'Sunday';
    if (day === 1)
        return 'Monday';
    if (day === 2)
        return 'Tuesday';
    if (day === 3)
        return 'Wednesday';
    if (day === 4)
        return 'Thursday';
    if (day === 5)
        return 'Friday';
    if (day === 6)
        return 'Saturday';
}

function getDate(day) {
    return new Date(day * 1000);
}

function getSearchedTime (offset) {
    let d = new Date()
    let localTime;
    localTime = d.getTime()
    let localOffset;
    localOffset = d.getTimezoneOffset() * 60000
    let utc;
    utc = localTime + localOffset
    let atlanta = utc + (1000 * offset)
    let newDate = new Date(atlanta)
    console.log(newDate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }));

    return newDate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
}

function getPercentage(low, high, numInBetween) {
    let result = (numInBetween - low) / (high - low)
    console.log(result)

    return returnOffset(result);
}

function returnOffset (percentage) {
    if (0 < percentage < .1)
        return 0;
    if (.1 < percentage < .2)
        return 2;
    if (.2 < percentage < .3)
        return 3;
    if (.3 < percentage < .4)
        return 4;
    if (.4 < percentage < .5)
        return 5;
    if (.5 < percentage < .6)
        return 6;
    if (.6 < percentage < .7)
        return 7;
    if (.7 < percentage < .8)
        return 8;
    if (.8 < percentage < .9)
        return 9;
    if (.9 < percentage <= 1)
        return 11;
}



