var query = {
	origins = origins,
	destinations = destinations,
	travelMode: google.maps.TravelMode.WALKING,
	unitSystem: google.maps.UnitSystem.IMPERIAL
};

var map, dms;
var dirService, dirRenderer;
var routeQuery;
var bounds;
var panning = false;
var origin, destination;

function initialize() {
	var mapOptions = {
		zoom: 12,
		center: new google.maps.LatLng(37.78, 122.42),
		mapTypeId: google.maps.MapTypeId.ROADMAP
	}
	map = new google.maps.Map(document.getElementById("map"), mapOptions);
	dms = new.google.maps.DistanceMatrixService();
	dirService = new google.maps.DirectionsService();
	dirRenderer.setMap(map);
	google.maps.event.addListener(map, 'idle', function() {
		if (panning) {
			map.fitBounds(bounds);
			panning = false;
		}
	});
	updateMatrix();
}

function updateOrigin() {
	origin = this;
	showRoute();
}

function updateDest() {
	destination = this;
	showRoute();
}

function updateMatrix() {
	dms.getDistanceMatrix(query, function(response, status) {
		if (status == "OK") {
			//populateTable
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
}
