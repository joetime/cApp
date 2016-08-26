angular.module('starter.services')
    .service('$gMapService', ['$acgoSettings', '$logService', '$cordovaGeolocation',
        function($acgoSettings, $logService, $cordovaGeolocation) {

            var log = $logService.log;
            log('gMapService init');

            var map; // the map!
            var drawingManager;
            var defaultPosition = $acgoSettings.mapDefaultPosition();
            var geolocationOptions = $acgoSettings.geolocation();

            // initalize map. returns map to caller
            function init(params) {
                params = params || {};

                var elementId = params.elementId || 'map'; //assume #map

                // create map
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

                if (map) {
                    log('map created!')
                } else {
                    log('map not created!!');
                    //return null;
                }

                // set up drawing mode if needed
                var drawingMode = params.drawingMode || false;
                if (drawingMode) {
                    log('initializing drawingManager')
                    drawingManager = new google.maps.drawing.DrawingManager({
                        //drawingMode: google.maps.drawing.OverlayType.MARKER,
                        drawingControl: true,
                        drawingControlOptions: {
                            position: google.maps.ControlPosition.TOP_CENTER,
                            drawingModes: ['marker', 'polygon', 'polyline'] // circle', 'polygon', 'polyline', 'rectangle']
                        },
                    });
                    drawingManager.setMap(map);
                }

                return map;
            }

            // center the map on something
            function center(obj) {

                if (obj) {
                    // passed a map object
                    log('center map on ', obj);

                    if (obj.position) {
                        log('center on object: ', obj.position.lat());
                        var myLatlng = {
                            lat: obj.position.lat(),
                            lng: obj.position.lng(),
                        };
                        map.panTo(myLatlng);
                    } else {
                        log('center on specific position not implemented');
                    }
                } else {
                    log('center map current location... ');
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

            // add listeners for each type of object
            function addDrawingListener(callback) {

                google.maps.event.addListener(drawingManager, 'overlaycomplete', function(overlay) {
                    log('overlay created: ', overlay);
                    // turn off creating
                    drawingManager.setDrawingMode(null);
                    // do callback
                    callback(overlay);
                });
            }

            return {
                init: init,
                center: center,
                addDrawingListener: addDrawingListener
            }
        }
    ]);