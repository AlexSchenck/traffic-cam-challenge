"use strict";

$(document).ready(onReady());

function onReady() {
	var mapOptions = {
		center: {lat: 47.6, lng: -122.3},
		zoom: 12
	};

	var mapElem = document.getElementById("map");
	var map = new google.maps.Map(mapElem, mapOptions);
	var infoWin = new google.maps.InfoWindow;
	var cameras;
	var markers = [];

	$("#search").bind("search keyup", function() {
		var search = $('#search').val();
		for (var i = 0; i < cameras.length; i++) {
			if (cameras[i].cameralabel.toLowerCase().indexOf(search.toLowerCase()) != -1) {
				markers[i].setMap(map);
			} else {
				markers[i].setMap(null);
			}
		}
	});

	$.getJSON('http://data.seattle.gov/resource/65fc-btcc.json')
		.done(function(data) {
			cameras = data;

			for (var i = 0; i < data.length; i++) {
				var position = {
					lat: parseFloat(data[i].location.latitude),
					lng: parseFloat(data[i].location.longitude)
				};

				var marker = new google.maps.Marker({
					position: position,
					map: map,
					animation: google.maps.Animation.DROP
				});

				markers.push(marker);

				google.maps.event.addListener(marker, "click", function() {
					map.panTo(this.getPosition());

					for (var index = 0; index < markers.length; index++) {
						if (this == markers[index]) {
							break;
						}
					}

					var label = cameras[index].cameralabel;
					var image = cameras[index].imageurl.url;

					infoWin.setContent("<p>" + label + "<br><img src=" + image + "></img></p>");
					infoWin.open(map, this);
				});
			}
		})
		.fail(function(error) {
			alert("Failed to get cameras");
		});
}
