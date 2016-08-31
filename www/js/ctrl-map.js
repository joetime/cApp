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
                console.log('openItem')
                if (!id) id = 0;
                var nav = '#/tab/map/' + id;
                log('nav to: ', nav)
                $window.location.href = nav;
            });

            // listen for center map from toolbar
            $commService.listen('centerMap', function(p) {
                $gMapService.center();
            })


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

                    // add a click listener
                    overlay.overlay.addListener('click', onOverlayClicked);

                });
            }

            function onOverlayClicked(overlay) {
                $scope.$apply(function() {
                    log('overlay clicked', overlay.latLng);
                    $scope.test = "overlay clicked";
                    $gMapService.center(overlay.latLng);
                    openPanel();
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