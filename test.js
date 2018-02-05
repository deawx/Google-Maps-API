var origins = [
    "Euston",
    "Kings Cross",
    "Liverpool St",
    "Paddington",
    "St. Pancras",
    "Victoria",
    "Waterloo",
  ];
  var destinations = [
    "Buckingham Palace",
    "Houses of Parliament",
    "Tower Bridge",
    "Trafalgar Square",
    "Westminster Abbey",
  ];
  var query = {
    origins: origins,
    destinations: destinations,
    travelMode: google.maps.TravelMode.WALKING,
    unitSystem: google.maps.UnitSystem.IMPERIAL
  };
  var map, dms;
  var dirService, dirRenderer;
  var highlightedCell;
  var routeQuery;
  var bounds;
  var panning = false;

  function initialize() {
    alert("meow");
    var mapOptions = {
      zoom: 12,
      center: new google.maps.LatLng(51.5, -0.126),
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    map = new google.maps.Map(document.getElementById("map"), mapOptions);
    // createTable();
    // for (var i = 0; i < origins.length; i++) {
    //   origins[i] += ' Station, London, UK';
    // }
    // for (var j = 0; j < destinations.length; j++) {
    //   destinations[j] += ', London, UK';
    // }
    dms = new google.maps.DistanceMatrixService();
    dirService = new google.maps.DirectionsService();
    dirRenderer = new google.maps.DirectionsRenderer({preserveViewport:true});
    dirRenderer.setMap(map);
    google.maps.event.addListener(map, 'idle', function() {
      if (panning) {
        map.fitBounds(bounds);
        panning = false;
      }
    });
    
    // updateMatrix();
  }
  function updateMatrix() {
    dms.getDistanceMatrix(query, function(response, status) {
        if (status == "OK") {
          populateTable(response.rows);
        }
      }
    );
  }
  function createTable() {
    var table = document.getElementById('matrix');
    var tr = addRow(table);
    addElement(tr);
    for (var j = 0; j < destinations.length; j++) {
      var td = addElement(tr);
      td.setAttribute("class", "destination");
      td.appendChild(document.createTextNode(destinations[j]));
    }
    for (var i = 0; i < origins.length; i++) {
      var tr = addRow(table);
      var td = addElement(tr);
      td.setAttribute("class", "origin");
      td.appendChild(document.createTextNode(origins[i]));
      for (var j = 0; j < destinations.length; j++) {
        var td = addElement(tr, 'element-' + i + '-' + j);
        td.onmouseover = getRouteFunction(i,j);
        td.onclick = getRouteFunction(i,j);
      }
    }
  }
  function populateTable(rows) {
    for (var i = 0; i < rows.length; i++) {
      for (var j = 0; j < rows[i].elements.length; j++) {
        var distance = rows[i].elements[j].distance.text;
        var duration = rows[i].elements[j].duration.text;
        var td = document.getElementById('element-' + i + '-' + j);
        td.innerHTML = distance + "<br/>" + duration;
      }
    }
  }
  function getRouteFunction(i, j) {
    return function() {
      routeQuery = {
        origin: origins[i],
        destination: destinations[j],
        travelMode: query.travelMode,
        unitSystem: query.unitSystem,
      };
      
      if (highlightedCell) {
        highlightedCell.style.backgroundColor="#ffffff";
      }
      highlightedCell = document.getElementById('element-' + i + '-' + j);
      highlightedCell.style.backgroundColor="#e0ffff";
      showRoute();
    }
  }
  function showRoute() {
    dirService.route(routeQuery, function(result, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        dirRenderer.setDirections(result);
        bounds = new google.maps.LatLngBounds();
        bounds.extend(result.routes[0].overview_path[0]);
        var k = result.routes[0].overview_path.length;
        bounds.extend(result.routes[0].overview_path[k-1]);
        panning = true;
        map.panTo(bounds.getCenter());        
      }
    });
  }
  function updateMode() {
    switch (document.getElementById("mode").value) {
      case "driving":
        query.travelMode = google.maps.TravelMode.DRIVING;
        break;
      case "walking":
        query.travelMode = google.maps.TravelMode.WALKING;
        break;
    }
    updateMatrix();
    if (routeQuery) {
      routeQuery.travelMode = query.travelMode;
      showRoute();
    }
  }
  function updateUnits() {
    switch (document.getElementById("units").value) {
      case "km":
        query.unitSystem = google.maps.UnitSystem.METRIC;
        break;
      case "mi":
        query.unitSystem = google.maps.UnitSystem.IMPERIAL;
        break;
    }
    updateMatrix();
  }
  function addRow(table) {
    var tr = document.createElement('tr');
    table.appendChild(tr);
    return tr;
  }
  function addElement(tr, id) {
    var td = document.createElement('td');
    if (id) {
      td.setAttribute('id', id);
    }
    tr.appendChild(td);
    return td;
  }