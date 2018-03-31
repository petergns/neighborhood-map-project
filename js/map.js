// Set Global Vaules for View Model and Info Window
var BaseViewModel;
var infoWindow;
// Set Place Locations
var Place = function(locations, BaseViewModel) {
  var self = this;
  var position = locations.COORD;
  this.title = ko.observable(locations.title);
  this.url = ko.observable(locations.url);
  this.street = ko.observable(locations.street);
  this.city = ko.observable(locations.city);
  this.foursquare = ko.observable(locations.foursquare);
  var id = locations.id;
  // Set Marker Styles/Type
  setMarkerIcon = function(markerColor) {
    var markerImage = new google.maps.MarkerImage(
      "http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|" +
      markerColor + "|40|_|%E2%80%A2", new google.maps.Size(21, 34), new google
      .maps.Point(0, 0), new google.maps.Point(10, 34), new google.maps.Size(
        21, 34));
    return markerImage;
  };
  var ampm = "";
  // Marker Icon Colors
  var defaultIcon = setMarkerIcon("5184eb");
  var highlightedIcon = setMarkerIcon("51d1eb");
  // Provide Marker InfoWindow Content
  var setTitle = this.title();
  var setURL = "https://" + this.url();
  var streetAddress = this.street();
  var cityAddress = this.city();
  var setFoursquare = this.foursquare();
  this.marker = new google.maps.Marker({
    position: position,
    title: setTitle,
    url: setURL,
    street: streetAddress,
    city: cityAddress,
    foursquare: setFoursquare,
    // Set Marker Animation Type
    animation: google.maps.Animation.DROP,
    icon: defaultIcon,
    id: id,
    map: map,
    visible: true
  });
  // Add Marker Listener
  this.marker.addListener("click", function() {
    populateInfoWindow(this, infoWindow);
    map.panTo(this.position);
    this.setAnimation(google.maps.Animation.BOUNCE);
    var marker = this;
    setTimeout(function() {
      marker.setAnimation(null);
    }, 750);
    // Update BaseViewModel Current Location
    BaseViewModel.currentLocation(marker);
  }, this);
  // Add Marker Listerner for Highlighted and Default Icon
  this.marker.addListener("mouseover", function() {
    this.setIcon(highlightedIcon, defaultIcon);
  });
  google.maps.event.addListener(map, "click", function(event) {
    infoWindow.close();
  });
  populateInfoWindow = function(marker, infowindow) {
    // Listerner to Check Whether InfoWindow Open
    infowindow.addListener("closeclick", function() {
      infowindow.marker = null;
    });
    var CLIENT_ID = "ZGDX32IX0JJJHUABCUAMSSJDIIF05TUOGDLAGTNRZVZOQJP5&";
    var CLIENT_SECRET = "NOFFF3HBE3MCCBUD1K4K20LVM1UC1MZ4R5R0DYV0N2QF4LGI&";
    var days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday",
      "Saturday", "Sunday"
    ];
    $.ajax({
      method: "get",
      url: "https://api.foursquare.com/v2/venues/" + marker.foursquare +
        "client_id=" + CLIENT_ID + "client_secret=" + CLIENT_SECRET +
        "v=20180329",
    }).done(function(apiData) {
      console.log(apiData.response.hours.timeframes[0]);
      $("#hoursList").empty();
      var timeframes = apiData.response.hours.timeframes;
      for (var i = 0; i < timeframes.length; i++) {
        console.log(timeframes[i].days);
        for (var k = 0;  k < timeframes[i].days.length; k++) {
          var dayIndex = timeframes[i].days[k];
          var timestring = "";
          for (var j = 0; j < timeframes[i].open.length; j++) {
            var timeObj = timeframes[i].open[j];
            var startString = timeObj.start.replace("+", "");
            var endString = timeObj.end.replace("+", "");
            timeString = timeSplit(startString) + "-" + timeSplit(
              endString);
            console.log(timeString);
          }
          // console.log(timeObj)
          var liString = "<li>" + days[dayIndex - 1] + "  " +
            timeString + "</li>";
          $("#hoursList").append(liString);
        }
      }
    }).fail(function(err) {
      console.log(err);
    });

    function timeSplit(time) {
      var hours = time.slice(0, 2);
      var minutes = time.slice(2, 4);
      if (hours[0] == "0") {
        hours = hours[1];
      }
      if (Number(hours) > 12) {
        var newHours = Number(hours) - 12;
        hours = newHours.toString();
        ampm = "PM";
      } else {
        ampm = "AM";
      }
      if (Number(hours) % 12 === 0) {
        if (Number(hours) === 12) {
          ampm = "PM";
        } else if (Number(hours) === 0 || Number(hours) === 24) {
          ampm = "AM";
          hours = "12";
        }
      }
      return hours + ":" + minutes + ampm;
    }
    // Set StreetView Radius
    var streetViewService = new google.maps.StreetViewService();
    var radius = 50;
    // If StreetViewStatus Okay Then Show StreetView
    getStreetView = function(data, status) {
      if (status == google.maps.StreetViewStatus.OK) {
        var nearStreetViewLocation = data.location.latLng;
        var heading = google.maps.geometry.spherical.computeHeading(
          nearStreetViewLocation, marker.position);
        var panoramaOptions = {
          position: nearStreetViewLocation,
          pov: {
            heading: heading,
            pitch: 10
          }
        };
        // Place New Function Here
        // Google Maps Panorama Box
        var panorama = new google.maps.StreetViewPanorama(document.getElementById(
          "pano-box"), panoramaOptions);
      } else {
        infowindow.setContent("<div>" + setTitle + streetAddress +
          cityAddress + setLike +
          "</div><div>No Street View Found</div>");
      }
    };
    // get the closest streetview image within 50 meters of marker
    streetViewService.getPanoramaByLocation(marker.position, radius,
      getStreetView);
    // Open infowindow on the selected marker
    infowindow.open(map, marker);
  };
};
var ViewModel = function() {
  var self = this;
  this.locationsList = ko.observableArray([]);
  // Create Map and Apply Google Maps API
  map = new google.maps.Map(document.getElementById("map"), {
    center: {
      lat: 38.899317,
      lng: -77.020963
    },
    zoom: 13,
    styles: mapstyle,
    mapTypeControl: false,
  });
  infoWindowShow = function() {
    // Set Info Window Content
    var StartID = "<div id=";
    var DivID = "\"InfoWindowBox\" data-bind=\"template:";
    var TmplType = "{ name: ";
    var TmplName = "'info-template'}\">";
    var EndID = "</div>";
    var infoShow = StartID + DivID + TmplType + TmplName + EndID;
    // Test
    infoWindow = new google.maps.InfoWindow({
      content: infoShow,
    });
    var infoWindowLoaded = false;
    google.maps.event.addListener(infoWindow, "domready", function() {
      if (!infoWindowLoaded) {
        ko.applyBindings(self, document.getElementById("InfoWindowBox"));
        infoWindowLoaded = true;
      }
    });
  };
  infoWindowShow();
  // Push Locations to Array Observable
  locations.forEach(function(COORD) {
    self.locationsList().push(new Place(COORD, self));
  });
  // Set Current Location
  self.currentLocation = ko.observable(this.locationsList()[0]);
  // Filter Place Titles
  this.filter = ko.observable("");
  this.filterList = ko.computed(function() {
    var matches = self.locationsList().filter(function(item) {
      if (item.title().toLowerCase().indexOf(self.filter().toLowerCase()) >=
        0) {
        item.marker.setVisible(true);
      } else {
        item.marker.setVisible(false);
      }
      return item.title().toLowerCase().indexOf(self.filter().toLowerCase()) >=
        0;
    });
    return matches;
  });
  // Show Menu and Hide Menu
  this.showToggleMenu = ko.observable(false);
  this.toggleMenu = function() {
    this.showToggleMenu(!this.showToggleMenu());
    if (this.showToggleMenu() === true) {
      map.panTo({
        lat: 38.892515,
        lng: -77.086545
      });
    } else {
      map.panTo({
        lat: 38.899317,
        lng: -77.020963
      });
      self.filter("");
    }
  };
  // When List Item Clicked Trigger Marker
  this.triggerMarker = function(place) {
    google.maps.event.trigger(place.marker, "click");
  };
};
// Initalize Map
StartMap = function() {
  BaseViewModel = new ViewModel();
  ko.applyBindings(BaseViewModel);
};
// Google Map Error Alert
mapError = function() {
  document.write("The Google Map has Failed to Load");
};
// Reload Map Function
function reloadMap() {
  location.reload();
}
