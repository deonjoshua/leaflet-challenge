var map = L.map('map').setView([0, 0], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";

var lat;
var lon;
var dep;
var mag;
var loc;
var colorScale = chroma.scale(["#e1da3d", "#ca0031", "#610032"]).domain([0, 600]);

d3.json(url).then(function(data){
    console.log(data);
    for (i=0; i<data["features"].length; i++){
      lon = data["features"][i]["geometry"]["coordinates"][0];
      lat = data["features"][i]["geometry"]["coordinates"][1];
      dep = data["features"][i]["geometry"]["coordinates"][2];
      mag = data["features"][i]["properties"]["mag"];
      loc = data["features"][i]["properties"]["place"];
      
      let newMarker = L.circleMarker([lat,lon], {
        radius: mag*3,
        fillColor: colorScale(dep),
        fillOpacity: 0.7,
        stroke: false
      });
      newMarker.addTo(map);  
      
      newMarker.on('mouseover',function(ev) {
        newMarker.openPopup();
      });
      newMarker.on('mouseout', function(ev) {
        newMarker.closePopup();
      });
      newMarker.bindPopup("Location: " + "<strong>" + loc + "</strong>" + "<br> Magnitude: " + "<strong>" + mag + "</strong>" + "<br> Depth: " + "<strong>" + dep + " km" + "</strong>");
    }

    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function (map) {
      var div = L.DomUtil.create('div', 'info legend');
      var grades = [0, 100, 200, 300, 400, 500];
      var labels = [];
      for (var i = 0; i < grades.length; i++) {
        labels.push(
          '<li style=\'background-color: ' + colorScale(grades[i]) + '\'>' + grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+') + '</li>'
        );
      }
      div.innerHTML = '<p>Depth(km)</p>' + labels.join('');
      return div;
    };
    legend.addTo(map);
});