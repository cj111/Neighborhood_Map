var map;
// Key locations in my neighborhood.
var locations = [
    {title: 'Childhood Home', location: {lat: 42.711220, lng: -71.171221}, isAvail: true, id: 0},
    {title: 'Old High School', location: {lat: 42.710649, lng: -71.163017}, isAvail: true, id: 1},
    {title: 'Wifes childhood home', location: {lat: 42.719901, lng: -71.160803}, isAvail: true, id: 2},
    {title: 'Old Middle School', location: {lat: 42.717417, lng: -71.174100}, isAvail: true, id: 3},
    {title: 'Pollo Tipico (local restaurant)', location: {lat: 42.715510, lng: -71.164881}, isAvail: true, id: 4},
    {title: 'Campagnone Park (Local Park)', location: {lat: 42.709491, lng: -71.160003}, isAvail: true, id: 5}
];

// Create a new blank array for all the listing markers.
var markers = [];

      function initMap() {

        // Constructor creates a new map.
        map = new google.maps.Map(document.getElementById('map'), {
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
            id: locations[i].id
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
		
		showAll();
		
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
      function showAll() {
        var bounds = new google.maps.LatLngBounds();
        // Extend the boundaries of the map for each marker and display the marker
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(map);
          bounds.extend(markers[i].position);
        }
        map.fitBounds(bounds);
      }

      // This function loops through the markers, 
	  //and shows the one corresponding to the ID passed.
      function showLoc(id) {
        for (var i = 0; i < markers.length; i++) {
		  if(markers[i].id == id) {
			  markers[i].setMap(map);
		  }
        }
      }
	  
	  // This function loops through the markers, 
	  //and hides the one corresponding to the ID passed.
      function hideLoc(id) {
        for (var i = 0; i < markers.length; i++) {
		  if(markers[i].id == id) {
			  markers[i].setMap(null);
		  }
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
	  
//near by food place of location
var locFoodInfo = function(location){
	
	var array = [];
	var latLng = location["lat"] + "," + location["lng"];
	
	$.getJSON('https://api.foursquare.com/v2/venues/search?ll=' + latLng +'&limit=3&radius=900&categoryId=4d4b7105d754a06374d81259&client_id=PKAHBB1OAX0B000CG5UUYO4BXV0LWQWKFB51EK3XVNFJ2ULS&client_secret=RDPX01C01RHCYASZIKVH5XXMPVFIPLFHFP1D53UR4GUWQD50&v=20140806',
	function(data) {
		$.each(data.response.venues, function(i,venues){
				var temp = '';
				if(venues.url){
					temp = venues.url;
				}else temp=null;
			
				array.push({name: venues.name, 
					address: venues.location.address,
				url: temp})

		   });
	}).error(function(e){
        console.log(e);
    });
	
	return array;
};

//Location object
var Loc = function(data) {
	this.title = ko.observable(data.title);
	this.location = ko.observable(data.location);
	this.isAvail = ko.observable(data.isAvail);
	this.id = ko.observable(data.id);
	
	this.foodPlacesList = ko.observableArray(locFoodInfo(data.location));
	
};

var viewModel = function() {
	var self = this;
	this.currentLoc = ko.observable(null);
	
	this.locList = ko.observableArray([]);
	
	locations.forEach(function(locItem) {
		self.locList.push(new Loc(locItem));
	});
	
	this.locFilter = function() {
		var input, filter;
		this.currentLoc(null);
		input = document.getElementById("myInput");
		filter = input.value.toUpperCase();
		
		for(i = 0; i < this.locList().length; i++) {
			if (this.locList()[i].title().toUpperCase().indexOf(filter) > -1) {
				this.locList()[i].isAvail(true);
				showLoc(this.locList()[i].id());
			} else {
				this.locList()[i].isAvail(false);
				hideLoc(this.locList()[i].id());
			};
		};
		
	};
	
	this.setCurrentLoc = function(clickedLoc) {
		self.currentLoc(clickedLoc);
	};
	
}

ko.applyBindings(new viewModel());
	  