// public/js/mapLogic.js

function initMap() {
    const location = { lat: 45.2710443, lng: -75.7461324 };

    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: location,
        mapId: "9e7a89853a456c80" // Add the Map ID here
    });

    // Use AdvancedMarkerElement
    const marker = new google.maps.marker.AdvancedMarkerElement({
        position: location,
        map: map,
        title: "S & S Fries - 2501 Greenbank Rd",
    });
}


