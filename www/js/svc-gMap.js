angular.module('starter.services').service('$gMapService', ['$acgoSettings', '$logService', '$cordovaGeolocation',
    function($acgoSettings, $logService, $cordovaGeolocation) {

        var log = $logService.log;
        log('gMapService init');

        var map; // the map!
        var defaultPosition = $acgoSettings.mapDefaultPosition();
        var geolocationOptions = $acgoSettings.geolocation();

        function init(elementId) {

            elementId = elementId || 'map'; //assume map

            map = new google.maps.Map(document.getElementById(elementId), {
                center: defaultPosition.center,
                scrollwheel: false,
                zoom: defaultPosition.zoom,
                zoomControlOptions: {
                    position: google.maps.ControlPosition.LEFT_TOP
                },
                streetViewControlOptions: {
                    position: google.maps.ControlPosition.LEFT_TOP
                },
            });

            return map;
        }

        function center(obj) {
            log('center map on ', obj)
            if (obj) {
                log('center on specific object/position not implemented');
            } else {
                // center on current position
                $cordovaGeolocation.getCurrentPosition(geolocationOptions).then(function(position) {

                        var myLatlng = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                            acc: position.coords.accuracy // only needed for logging
                        };

                        log('position found', myLatlng);

                        var zoom = 19;
                        if (position.coords.accuracy > 1000) zoom = 17;

                        map.setCenter(myLatlng);
                        map.setZoom(zoom);
                    },
                    function(err) {
                        log('could not get position')
                    });
            }
        }

        function addMarker(params) {

            if (params.latLng) {

            } else {

            }
        }

        return {
            init: init,
            center: center,
            addMarker: addMarker
        }
    }
]);