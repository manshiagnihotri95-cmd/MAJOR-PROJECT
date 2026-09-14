var map = L.map('map').setView([22.5000,73.4667], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap'
}).addTo(map);

L.marker([22.5000,73.4667]).addTo(map);


