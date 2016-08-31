angular.module('starter.controllers')
    .controller("MapCtrl",

        function($scope, $acgoSettings, $cordovaCamera, $cordovaGeolocation,
            $logService, $gMapService, $timeout, $optionsService, $itemService, $window) {

            var log = $logService.log;
            var map;

            // entire US map by default
            var defaultPosition = $acgoSettings.mapDefaultPosition();
            var geolocationOptions = $acgoSettings.geolocation();

            $scope.openItem = function(id) {
                console.log('openItem')
                if (!id) id = 0;
                var nav = '#/tab/map/' + id;
                log('nav to: ', nav)
                $window.location.href = nav;
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
                    $scope.$apply(function() {
                        log('map clicked: ', $event);
                        $scope.test = "map clicked";
                    });
                });

                // on drawing object created
                $gMapService.addDrawingListener(onOverlayCreated);

                // so we know we've already initialized
                return true;
            }

            function onOverlayCreated(overlay) {
                $scope.$apply(function() {
                    log('overlay created', overlay);
                    $scope.test = "overlay created";
                    overlay.overlay.addListener('click', onOverlayClicked);
                    $gMapService.center(overlay.overlay);
                    $scope.editing = $itemService.empty;
                    $scope.editing.overlayType = overlay.type;
                    openPanel();
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

            // try to get the current position
            // and recenter the map
            $gMapService.center();

            $scope.takePicture = function() {

                var options = $acgoSettings.camera();
                log('camera options', options, true);

                $cordovaCamera.getPicture(options).then(function(imageDataURL) {

                    // show picture in UI
                    $scope.imgURI = "data:image/jpeg;base64," + imageDataURL;

                    if (imageDataURL && confirm('test upload?')) {

                        log('attempting upload', imageDataURL, true)
                        $scope.uploading = true;
                        $scope.uploadUrl = '';

                        $http({
                            method: 'POST',
                            url: Backand.getApiUrl() + '/1/objects/action/Test/1',
                            params: {
                                name: 'files',
                                parameters: {
                                    filename: 'test.jpg',
                                }
                            },
                            config: {
                                ignoreError: true
                            },
                            data: {
                                filedata: imageDataURL
                            }
                        }).then(function(d) {
                                log('camera upload success', d, true);
                                $scope.uploadResult = d;
                                $scope.uploadUrl = d.url;
                                $scope.uploading = false;
                            },
                            function(err) {
                                log('camera upload error', err, true);
                                $scope.uploadResult = err;
                                $scope.uploading = false;
                            });
                    }

                }, function(err) {
                    log('error getting picture', err, true);
                    // An error occured. Show a message to the user
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