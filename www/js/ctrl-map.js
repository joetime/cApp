angular.module('starter.controllers')
    .controller("MapCtrl",

        function($scope, $acgoSettings, $cordovaCamera, $cordovaGeolocation,
            $logService, $gMapService, $timeout, $optionsService, $itemService, $window,
            $commService) {

            var log = $logService.log;
            var map;

            // entire US map by default
            var defaultPosition = $acgoSettings.mapDefaultPosition();
            var geolocationOptions = $acgoSettings.geolocation();

            // listen for the openItem event from toolbar
            $commService.listen('openItem', function(id) {
                /*console.log('openItem')
                if (!id) id = 0;
                var nav = '#/tab/map/' + id;
                log('nav to: ', nav)
                $window.location.href = nav;*/
            });

            // listen for center map from toolbar
            $commService.listen('centerMap', function(p) {
                $gMapService.center();
            })

            $commService.listen('mapDrawingMode', function(mode) {
                $gMapService.setDrawingMode(mode);
            });

            // initalize the map. returns true so it doesn't fire again
            function init() {
                log('MapCtrl init');

                // create the map
                map = $gMapService.init({
                    drawingMode: true,
                    drawingModeDisableAfterCreate: true
                });
                // on map click 
                map.addListener('click', function($event) {
                    $scope.$apply(function() {
                        log('map clicked: ', $event);
                        $scope.test = "map clicked";
                    });
                });

                // on drawing object created
                $gMapService.addDrawingListener(onOverlayCreated);

                $gMapService.center();

                // so we know we've already initialized
                return true;
            }

            function onOverlayCreated(overlay) {
                $scope.$apply(function() {

                    log('overlay created', overlay);

                    // center on the item
                    $gMapService.center(overlay.overlay);

                    // save item
                    var item = $itemService.empty();
                    item.overlayType = overlay.type;

                    // get one point if marker
                    if (item.overlayType == 'marker') {
                        item.points = {
                            lat: overlay.overlay.position.lat(),
                            lng: overlay.overlay.position.lng()
                        };
                    }
                    // get the array of coordinates
                    if (item.overlayType == 'polygon' || item.overlayType == 'polyline') {

                        var vertices = overlay.overlay.getPath();
                        var pts = [];
                        for (var i = 0; i < vertices.getLength(); i++) {
                            var xy = vertices.getAt(i);
                            pts.push({
                                lat: xy.lat(),
                                lng: xy.lng()
                            });
                        }
                        item.points = pts;
                    }
                    // polygon dimensions
                    if (item.overlayType == 'polygon') {
                        item.quantity =
                            Math.floor(10.7639 * google.maps.geometry.spherical.computeArea(overlay.overlay.getPath()));
                        item.unit = "SF";
                    }
                    // polyline dimensions
                    if (item.overlayType == 'polyline') {
                        item.quantity =
                            Math.floor(3.28084 * google.maps.geometry.spherical.computeLength(overlay.overlay.getPath()));

                        item.unit = "LF";
                    }

                    // save item, then emit event
                    $itemService.save(item, function(item) {

                        // add a click listener
                        // this also associates the item with the marker
                        overlay.overlay.addListener('click', function(ov) {
                            // ov is a lightweight version of the overlay...
                            // don't know why, but that's what google sends on the click event
                            onOverlayClicked(ov, item);
                        });

                        console.log('overlay modified = ', overlay);
                        $commService.emit('editItem', item);
                    });

                });
            }

            function onOverlayClicked(overlay, item) {
                $scope.$apply(function() {
                    log('overlay clicked', overlay);
                    log('overlay clicked', item);

                    // center on item
                    $gMapService.center(overlay.latLng);

                    // item is saved as property of overlay
                    //var item = overlay.assetcalc.item;

                    // emit event
                    $commService.emit('editItem', item);
                });
            }

            // initalize the controller
            var initialized;
            if (!initialized)
                initialized = init();

        })

.controller('MapDetailCtrl',
    function($scope, $stateParams, $itemService, $logService) {
        var log = $logService.log;
        log('MapDetailCtrl init');

        $scope.item = $itemService.empty;
    })