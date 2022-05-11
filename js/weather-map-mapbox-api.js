'use strict';

mapboxgl.accessToken = MAPBOXGL_ACCESS_TOKEN;

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v10',
    center: [-98.4916, 29.4252],
    zoom: 10
});

const mapboxgeocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    marker: false,
})

const gps = new mapboxgl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    },
// When active the map will receive updates to the device's location as it changes.
    trackUserLocation: true,
// Draw an arrow next to the location dot to indicate which direction the device is heading.
    showUserHeading: true
})

let currentMarkers = [];

map.addControl(
    mapboxgeocoder
);

function createMarker (lng, lat) {

    for (let i = 0; i < currentMarkers.length; i++) {
        currentMarkers[i].remove();
    }


    let newMarker = new mapboxgl.Marker({color: '#ec6e4c'})
        .setLngLat([lng, lat])
        .addTo(map);
    currentMarkers.push(newMarker);

    return newMarker
}

function getLngLat (results) {
    getLocationData(results[0], results[1]);
}


mapboxgeocoder.on('result', function (results){

    let addressSearchArray = results.result.place_name.split(', ')
    let address = results.result.place_name.split(', ')

    geocode(`${results.result.place_name}`, MAPBOXGL_ACCESS_TOKEN).then(function (result){

        getLocationData(result[1], result[0],addressSearchArray.join(", "));

        createMarker(result[0], result[1]);
    });
});

map.on('click', function (result){

    createMarker(result.lngLat.lng, result.lngLat.lat);

    let lat = result.lngLat.lat;
    let lng = result.lngLat.lng;
    let tempArray = [];

    reverseGeocode(result.lngLat, MAPBOXGL_ACCESS_TOKEN).then(function (result){
        tempArray = result.split(', ');
        getLocationData(lat, lng, tempArray.join(', '));
    });
})







const layerList = document.getElementById('menu');
const inputs = layerList.getElementsByTagName('input');



for (const input of inputs) {
    input.onclick = (layer) => {
        const layerId = layer.target.id;
        console.log(layer.target.id);

        if(layerId === 'light-v10' || layerId === 'streets-v11' || layerId === 'satellite-v9' || layerId === 'outdoors-v11') {
            $('#css').attr('href', 'css/weather-map-light.css');
        } else $('#css').attr('href', 'css/weather-map.css');

        map.setStyle('mapbox://styles/mapbox/' + layerId);
    };
}