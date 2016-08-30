angular.module('starter.controllers')
    .controller("MapCtrl",
        function($scope, $acgoSettings, $cordovaCamera, $cordovaGeolocation, $logService, $gMapService, $timeout) {

            var log = $logService.log;
            var map;

            // entire US map by default
            var defaultPosition = $acgoSettings.mapDefaultPosition();
            var geolocationOptions = $acgoSettings.geolocation();

            $scope.test = "-";

            $scope.centerMap = function(pos) {
                $gMapService.center();
            };

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
            }

            function onOverlayCreated(overlay) {
                $scope.$apply(function() {
                    log('overlay created', overlay);
                    $scope.test = "overlay created";
                    overlay.overlay.addListener('click', onOverlayClicked);
                });
            }

            function onOverlayClicked(overlay) {
                $scope.$apply(function() {
                    log('overlay clicked', overlay);
                    $scope.test = "overlay clicked";
                });
            }

            // try to get the current position
            // and recenter the map
            $gMapService.center();


            // initalize the controller
            init();

        })