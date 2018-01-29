var map;
// Key locations in my neighborhood.
var locations = [
    {title: 'Parents House', location: {lat: 42.711220, lng: -71.171221}, isAvail: true},
    {title: 'Old High School', location: {lat: 42.710649, lng: -71.163017}, isAvail: true},
    {title: 'Girlfriends House', location: {lat: 42.719901, lng: -71.160803}, isAvail: true},
    {title: 'Old Middle School', location: {lat: 42.717417, lng: -71.174100}, isAvail: true},
    {title: 'Pollo Tipico (local restaurant)', location: {lat: 42.715510, lng: -71.164881}, isAvail: true},
    {title: 'Campagnone Park (Local Park)', location: {lat: 42.709491, lng: -71.160003}, isAvail: true}
];

      // Create a new blank array for all the listing markers.
      var markers = [];

      function initMap() {

        // Constructor creates a new map - only center and zoom are required.
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 42.711220, lng: -71.171221},
          zoom: 15,
          mapTypeControl: false
        });

        var largeInfowindow = new google.maps.InfoWindow();

        // Style the markers.
        var defaultIcon = makeIcon('0091ff');

        // Create a "highlighted location" marker color for when the user
        // mouses over the marker.
        var highlightedIcon = makeIcon('FFFF24');

        var largeInfowindow = new google.maps.InfoWindow();
        // The following group uses the location array to create an array of markers on initialize.
        for (var i = 0; i < locations.length; i++) {
          // Get the position from the location array.
          var position = locations[i].location;
          var title = locations[i].title;
          // Create a marker per location, and put into markers array.
          var marker = new google.maps.Marker({
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            icon: defaultIcon,
            id: i
          });
          // Push the marker to our array of markers.
          markers.push(marker);
          // Create an onclick event to open the large infowindow at each marker.
          marker.addListener('click', function() {
            populateInfoWindow(this, largeInfowindow);
          });
          // Two event listeners - one for mouseover, one for mouseout,
          // to change the colors back and forth.
          marker.addListener('mouseover', function() {
            this.setIcon(highlightedIcon);
          });
          marker.addListener('mouseout', function() {
            this.setIcon(defaultIcon);
          });
        }

        document.getElementById('show-listings').addEventListener('click', showListings);
        document.getElementById('hide-listings').addEventListener('click', hideListings);
      }

      // This function populates the infowindow when the marker is clicked. We'll only allow
      // one infowindow which will open at the marker that is clicked, and populate based
      // on that markers position.
      function populateInfoWindow(marker, infowindow) {
        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {
          infowindow.marker = marker;
          infowindow.setContent('<div>' + marker.title + '</div>');
          infowindow.open(map, marker);
          // Make sure the marker property is cleared if the infowindow is closed.
          infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
          });
        }
      }

      // This function will loop through the markers array and display them all.
      function showListings() {
        var bounds = new google.maps.LatLngBounds();
        // Extend the boundaries of the map for each marker and display the marker
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(map);
          bounds.extend(markers[i].position);
        }
        map.fitBounds(bounds);
      }

      // This function will loop through the locations and hide them all.
      function hideListings() {
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(null);
        }
      }

      // This function takes in a COLOR, and then creates a new
      // icon of that color. The icon will be 21 px wide by 34 high, have an origin
      // of 0, 0 and be anchored at 10, 34).
	  function makeIcon(markerColor) {
        var image = {
          url: 'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
          '|40|_|%E2%80%A2',
          size: new google.maps.Size(21, 34),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(10, 34),
		  scaledSize: new google.maps.Size(21,34)};
        return image;
      }
	  
var Loc = function(data) {
	this.title = ko.observable(data.title);
	this.location = ko.observable(data.location);
	this.isAvail = ko.observable(data.isAvail);
	
}

var viewModel = function() {
	var self = this;
	
	this.locList = ko.observableArray([]);
	
	locations.forEach(function(locItem) {
		self.locList.push(new Loc(locItem));
	});
	
	this.myFunction = function() {
		var input, filter;
		input = document.getElementById("myInput");
		filter = input.value.toUpperCase();
		
		for(i = 0; i < this.locList().length; i++) {
			if (this.locList()[i].title().toUpperCase().indexOf(filter) > -1) {
				this.locList()[i].isAvail(true);
			} else {
				this.locList()[i].isAvail(false);

			};
		};
		
	};
	
}

ko.applyBindings(new viewModel());
	  