      var map;
      function initMap() {
        // Constructor creates a new map - only center and zoom are required.
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 38.899317, lng: -77.020963},
          zoom: 16
        });
      }
