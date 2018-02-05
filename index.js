var city = ', San Francisco, CA';
var origins = ['Embarcadero Station' + city];
var destinations = ['Golden Gate Bridge' + city];

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
	showRoute();
	updateMatrix();
}

function updateMatrix() {
	dms.getDistanceMatrix(query, function(response, status) {
		if (status == "OK") {
			//populateTable
			console.log("huh");
		}
	});
}

// function updateOrigin() {
// 	origins = [document.getElementById("origin").value + ' Station' + city];
// 	updateMatrix();
// 	showRoute();
// }

// function updateDest() {
// 	destinations = [document.getElementById("dest").value + city];
// 	console.log(destinations);
// 	updateMatrix();
// 	showRoute();
// }

function getRouteFunction() {
	routeQuery = {
		origin: [document.getElementById("origin").value + ' Station' + city],
		destination: [document.getElementById("dest").value + city],
		travelMode: query.travelMode,
		unitSystem: query.unitSystem
	};
	showRoute();
}

function showRoute() {
	console.log("HI " + query);
	dirService.route(routeQuery, function(result, status) {
		console.log(status);
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
	// updateMatrix();
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
	// updateMatrix();
}