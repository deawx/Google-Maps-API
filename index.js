var city = ", San Francisco, CA";
var origins = ["Embarcadero Station" + city];
var destinations = ["Golden Gate Bridge" + city];

var query = {
	origins: origins,
	destinations: destinations,
	travelMode: google.maps.TravelMode.WALKING,
	unitSystem: google.maps.UnitSystem.IMPERIAL
};

var map, dms;
var dirService, dirRenderer;
var routeQuery;
var bounds;
var panning = false;

function initialize() {
	var mapOptions = {
		zoom: 12,
		center: new google.maps.LatLng(37.78, -122.42),
		mapTypeId: google.maps.MapTypeId.ROADMAP
	}
	map = new google.maps.Map(document.getElementById("map"), mapOptions);
	dms = new google.maps.DistanceMatrixService();
	dirService = new google.maps.DirectionsService();
	dirRenderer = new google.maps.DirectionsRenderer({preserveViewport: true});
	dirRenderer.setMap(map);
	google.maps.event.addListener(map, 'idle', function() {
		if (panning) {
			map.fitBounds(bounds);
			panning = false;
		}
	});
	getRouteFunction();
	updateMatrix();
}

function updateMatrix() {
	query.origins = [routeQuery.origin];
	query.destinations = [routeQuery.destination];
	dms.getDistanceMatrix(query, function(response, status) {
		if (status == "OK") {
			document.getElementById("details").innerHTML = "Distance: " + response.rows[0].elements[0].distance.text + ", duration: " + response.rows[0].elements[0].duration.text;
			console.log(response);
		}
	});
}

function getRouteFunction() {
	routeQuery = {
		// ORIGIN IS NOT AN ARRAY IN ROUTEQUERY!!, unlike in query
		origin: document.getElementById("ori").value + " Station" + city,
		destination: document.getElementById("dest").value + city,
		travelMode: query.travelMode,
		unitSystem: query.unitSystem
	};
	showRoute();
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
	updateMatrix();
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