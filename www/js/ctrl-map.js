angular.module('starter.controllers')
    .controller("MapCtrl",
        function($scope, $acgoSettings, $cordovaCamera, $cordovaGeolocation, $logService, $gMapService) {

            var log = $logService.log;

            var map;

            // entire US map by default
            var defaultPosition = $acgoSettings.mapDefaultPosition();
            var geolocationOptions = $acgoSettings.geolocation();

            $scope.centerMap = function(pos) {
                $gMapService.center();
            };

            function init() {
                log('MapCtrl init');

                // create the map
                map = $gMapService.init();
                map.addListener('click', function($event) {
                    log('map clicked: ', $event);
                });

                // try to get the current position
                // and recenter the map
                $gMapService.center();
            }

            // initalize the controller
            init();

        })