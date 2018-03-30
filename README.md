Neighborhood Map Project
====================
Project files for the Neighborhood Map in the Udacity Full Stack Nanodegree.

This project contains a map of places to meet around Washington D.C.

## Set Up Instructions

Follow these instructions to set up the Neighborhood Map Project.

### Required Starting Resources:
* Web Browser such as Chrome, Firefox, or Safari.
* An Editor such as Atom, Notepad++, Sublime Text.
* Some knowledge of HTML, CSS, and JS.

### Create Google Account

1. Create Google Developer Account: https://console.developers.google.com/apis/dashboard
2. Create a API key: https://developers.google.com/maps/documentation/javascript/get-api-key

### Add Google Maps API
1. Create Project and Credentials.
2. Add the following API to your project: https://console.developers.google.com/apis/library?
```
* Google Maps Directions API
* Google Maps Distance Matrix API
* Google Maps Elevation API
* Google Maps Geocoding API
* Google Maps Geolocation API
* Google Maps JavaScript API
* Google Maps Roads API
* Google Maps Time Zone API
* Google Places API Web Service
* Google Static Maps API
* Google Street View Image API
```

### Add your Google API Key
Add your Google API Key in the index.html file:
```
https://maps.googleapis.com/maps/api/js?libraries=places,geometry,drawing&key=YOURKEYHERE&v=3&callback=StartMap
```

### Create Foursquare Developer Account
1. Create Foursquare Developer Account: https://developer.foursquare.com/
2. Create an API Key: https://developer.foursquare.com/docs/api/getting-started

### Add your Foursquare Developer API Key
Add your Foursquare API  key in the maps.js file:
```
var CLIENT_ID = "client_id=YOUR_CLIENT_ID&";
var CLIENT_SECRET = "client_secret=YOUR_CLIENT_SECRET&";
```

### Load the Map
Open the index.html file in a web browser to load the Map.

### Useful Editors:
* Atom(https://atom.io/)
* Notepad++(https://notepad-plus-plus.org/)
* Sublime Text(https://www.sublimetext.com/)

### Meetup Map when in Browser:
![Image of Output](https://raw.githubusercontent.com/petergns/neighborhood-map-project/master/img/map-example-1.PNG)

## Author
[petergns](https://github.com/petergns)

### Free Image Resource
1. https://pixabay.com/en/the-location-of-the-map-where-way-1724293/

## Acknowledgments
Acknowledgments to the following for helping me develop this project:
* [Udacity](https://www.udacity.com/)
* [Google Maps API](https://developers.google.com/maps/documentation/javascript/)
* [Bootstrap](https://getbootstrap.com/)
* [Foursquare](https://foursquare.com/)
