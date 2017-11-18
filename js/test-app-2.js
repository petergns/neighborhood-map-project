  var map;

  // Create a new blank array for all the listing markers.
  var markers = [];

  var locations = [{
      title: 'Starbucks',
      location: {
        lat: 38.899989,
        lng: -77.022143
      }
    },
    {
      title: 'Chinatown Metro',
      location: {
        lat: 38.899635,
        lng: -77.021821
      }
    },
    {
      title: 'Smithsonian Station',
      location: {
        lat: 38.889099,
        lng: -77.028463
      }
    },
    {
      title: 'Federal Triangle',
      location: {
        lat: 38.893782,
        lng: -77.028315
      }
    },
    {
      title: 'LEnfant Plaza Station',
      location: {
        lat: 38.884784,
        lng: -77.020884
      }
    },
    {
      title: 'Woodley Park-Zoo Metro Station',
      location: {
        lat: 38.924519,
        lng: -77.052387
      }
    },
    {
      title: 'Navy-Yard Ballpark Station',
      location: {
        lat: 38.876673,
        lng: -77.004506
      }
    },
    {
      title: 'Rosslyn Station',
      location: {
        lat: 38.895805,
        lng: -77.071909
      }
    },
    {
      title: 'Panera Bread',
      location: {
        lat: 38.895588,
        lng: -77.072040
      }
    },
    {
      title: 'Fort Totten Station',
      location: {
        lat: 38.951723,
        lng: -77.002113
      }
    }
  ];

  function initMap() {
    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
      center: {
        lat: 38.899317,
        lng: -77.020963
      },
      zoom: 14,
      mapTypeControl: false
    });

    // These are the real estate listings that will be shown to the user.
    // Normally we'd have these in a database instead.

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
        id: i,
        map:map
      });
      // Push the marker to our array of markers.
      locations[i].marker = marker

      // Create an onclick event to open an infowindow at each marker.
      marker.addListener('click', function() {
        populateInfoWindow(this, largeInfowindow);
      });
    }
    ko.applyBindings(new ViewModel())
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

  //

  function ViewModel() {
    var self = this
    self.places = ko.observableArray(locations)
    console.log(self.places())
  }
