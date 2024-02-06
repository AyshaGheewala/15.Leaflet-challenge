// Create a map object.
let myMap = L.map("map", {
    center: [44.500000, -100.000000],
    zoom: 2.5
  });

// Add a tile layer.
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Use this link to get the GeoJSON data
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"

// Getting our GeoJSON data
d3.json(url).then(function(data) {
    features = data.features;
    // Loop through the data.
    for (let i = 0; i < features.length; i++) {
        // Set the coordinates to a variable.
        let location = features[i].geometry.coordinates;

        // Adjust the marker color depending on depth of the earthquake
        // Earthquakes with greater depth should appear darker in color.
        let color = "";
        if (location[2] > 100) {
        color = "#5c0c0c";
        }
        else if (location[2] > 50) {
        color = "#c10f0f";
        }
        else if (location[2] > 20) {
        color = "#f65a5a";
        }
        else {
        color = "#fcb2b2";
        }

        // Check for the location property and insert marker
        if (location) {
            L.circle([location[1], location[0]], {
                fillOpacity: 0.75,
                // Adjust the color depending on depth of the earthquake
                color: color,
                fillColor: color,
                // Adjust the size depending on magnitude of the earthquake
                // Earthquakes with higher magnitudes should appear larger
                radius: (features[i].properties.mag) * 15000
            }).bindPopup("<h3> Location: " + features[i].properties.place + "</h3> <hr> <h3> Magnitude: " + features[i].properties.mag + "</h3> <h3> Depth: " + location[2] + "</h3>")
            .addTo(myMap);
        };   
    };

    // Create legend
    let legend = L.control({ position: "bottomright" });
    legend.onAdd = function(map) {
        let div = L.DomUtil.create("div", "legend");
        div.innerHTML += "<h4>Depth of Earthquake</h4>";
        div.innerHTML += '<i style="background: #fcb2b2"></i><span><20</span><br>';
        div.innerHTML += '<i style="background: #f65a5a"></i><span>20-50</span><br>';
        div.innerHTML += '<i style="background: #c10f0f"></i><span>50-100</span><br>';
        div.innerHTML += '<i style="background: #5c0c0c"></i><span>>100</span><br>';
        return div;
    };

    // Add the legend to the map
    legend.addTo(myMap);

});