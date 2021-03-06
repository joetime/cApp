angular.module('starter.services')
    .service('$gMapService', ['$acgoSettings', '$logService', '$cordovaGeolocation',
        function($acgoSettings, $logService, $cordovaGeolocation) {

            var log = $logService.log;
            log('gMapService init');

            var map; // the map!
            var drawingManager;
            var defaultPosition = $acgoSettings.mapDefaultPosition();
            var geolocationOptions = $acgoSettings.geolocation();
            var drawingControlsVisible = false;

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
                }

                // set up drawing mode if needed
                var drawingMode = params.drawingMode || false;
                if (drawingMode) {
                    log('initializing drawingManager')
                    drawingManager = new google.maps.drawing.DrawingManager({
                        //drawingMode: google.maps.drawing.OverlayType.MARKER,
                        drawingControl: drawingControlsVisible,
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
            function center(obj, callback) {

                if (typeof obj === 'function') {
                    callback = obj;
                    obj = undefined;
                }

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
                    } else if (obj.lat && typeof obj.lat === 'function') {
                        log('center on overlay: marker: ', obj);
                        var myLatlng = {
                            lat: obj.lat(),
                            lng: obj.lng(),
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

            // check resize
            function checkResize(callback) {
                // waits for ui to catch up
                log('will resize in 1 sec...')
                setTimeout(function() {
                    google.maps.event.trigger(map, "resize");
                    log('resized');
                    if (callback) callback();
                }, 1000);
            }

            function currentDrawingMode() {
                //log('getting current mode', drawingManager.drawingMode);
                return drawingManager.drawingMode;
            }

            function setDrawingMode(mode) {

                console.log('current mode: ', drawingManager.drawingMode);
                var MODE;

                // toggle OUT of the current mode
                if (mode == drawingManager.drawingMode)
                    MODE = null;

                else if (mode == 'marker') MODE = google.maps.drawing.OverlayType.MARKER;
                else if (mode == 'polyline') MODE = google.maps.drawing.OverlayType.POLYLINE;
                else if (mode == 'polygon') MODE = google.maps.drawing.OverlayType.POLYGON;

                drawingManager.setOptions({
                    drawingMode: MODE
                });
            }

            return {
                init: init,
                center: center,
                addDrawingListener: addDrawingListener,
                checkResize: checkResize,
                setDrawingMode: setDrawingMode,
                currentDrawingMode: currentDrawingMode
            }
        }
    ]);