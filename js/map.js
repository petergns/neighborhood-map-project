// global access to the BaseViewModel
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
  var id = locations.id;
  // Set Marker Styles/Type
  makeMarkerIcon = function(markerColor) {
    var markerImage = new google.maps.MarkerImage(
      "http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|" +
      markerColor + "|40|_|%E2%80%A2", new google.maps.Size(21, 34), new google
      .maps.Point(0, 0), new google.maps.Point(10, 34), new google.maps.Size(
        21, 34));
    return markerImage;
  };
  // Marker Icon Colors
  var defaultIcon = makeMarkerIcon("EBB851");
  var highlightedIcon = makeMarkerIcon("FF7878");
  // Provide Marker InfoWindow Content
  var setTitle = this.title();
  var setURL = "https://" + this.url();
  var streetAddress = this.street();
  var cityAddress = this.city();
  this.marker = new google.maps.Marker({
    position: position,
    title: setTitle,
    url: setURL,
    street: streetAddress,
    city: cityAddress,
    // Set animation type
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
    // update current location
    BaseViewModel.currentLocation(marker);
  }, this);
  // Merged
  this.marker.addListener("mouseover", function() {
    this.setIcon(highlightedIcon, defaultIcon);
  });
  google.maps.event.addListener(map, "click", function(event) {
    infoWindow.close();
  });
  populateInfoWindow = function(marker, infowindow) {
    // make sure infowindow is not open already
    infowindow.addListener("closeclick", function() {
      infowindow.marker = null;
    });
    var streetViewService = new google.maps.StreetViewService();
    var radius = 50;
    // if Status OK, comput position of street view image
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
        var panorama = new google.maps.StreetViewPanorama(document.getElementById(
          "pano"), panoramaOptions);
      } else {
        infowindow.setContent("<div>" + setTitle + streetAddress +
          cityAddress + "</div><div>No Street View Found</div>");
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
  // create main map, google maps api
  map = new google.maps.Map(document.getElementById("map"), {
    center: {
      lat: 38.899317,
      lng: -77.020963
    },
    zoom: 13,
    styles: mapstyle,
    mapTypeControl: false
  });
  infoWindowShow = function() {
    var StartID = "<div id=";
    var DivID = "\"InfoWindowBox\" data-bind=\"template:";
    var TmplType = "{ name: ";
    var TmplName = "'info-template'}\">";
    var EndID = "</div>";
    var infoShow = StartID + DivID + TmplType + TmplName + EndID;
    infoWindow = new google.maps.InfoWindow({
      content: infoShow
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
  // push locations to observable array
  locations.forEach(function(COORD) {
    self.locationsList()
      .push(new Place(COORD, self));
  });
  // current location
  self.currentLocation = ko.observable(this.locationsList()[0]);
  // filter functionality, var set blank
  this.filter = ko.observable("");
  this.filterList = ko.computed(function() {
    var matches = self.locationsList()
      .filter(function(item) {
        if (item.title()
          .toLowerCase()
          .indexOf(self.filter()
            .toLowerCase()) >= 0) {
          item.marker.setVisible(true);
        } else {
          item.marker.setVisible(false);
        };
        return item.title()
          .toLowerCase()
          .indexOf(self.filter()
            .toLowerCase()) >= 0;
      });
    return matches
  });
  // show and hide menu
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
    };
  };
  // trigger marker click, when list item is clicked
  this.triggerMarker = function(place) {
    google.maps.event.trigger(place.marker, "click");
  };
};
// Initalize Map
StartMap = function() {
  BaseViewModel = new ViewModel()
  ko.applyBindings(BaseViewModel);
};
// Google Map Error Alert
mapError = function() {
  document.write("The Google Map has Failed to Load");
}