angular.module('starter.controllers')
    .controller("MapCtrl",
        function($scope, $acgoSettings, $cordovaCamera, $cordovaGeolocation, $logService, $gMapService) {

            var log = $logService.log;
            var map;

            // entire US map by default
            var defaultPosition = $acgoSettings.mapDefaultPosition();
            var geolocationOptions = $acgoSettings.geolocation();

            // form starts hidden
            $scope.showForm = false;
            $scope.hideForm = function() {
                $scope.showForm = false;
            }

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
                    log('map clicked: ', $event);
                });

                // on drawing object created
                $gMapService.addDrawingListener(function(drawingObject) {
                    log('drawing object created:', drawingObject.type);

                    drawingObject.overlay.addListener('click', function($event) {
                        log('marker clicked: ', $event);
                        openAndCenterObject($event);
                    });

                    openAndCenterObject(drawingObject.overlay);
                });

                // try to get the current position
                // and recenter the map
                $gMapService.center();
            }

            function openAndCenterObject(obj) {
                $gMapService.center(obj);
                $scope.showForm = true;
                //$scope.$apply();
            }

            // initalize the controller
            init();

        })