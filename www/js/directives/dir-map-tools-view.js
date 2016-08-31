angular.module('starter')
    .directive('mapToolsView', ['$logService', '$commService', '$acgoSettings', '$cordovaCamera',

        function($logService, $commService, $acgoSettings, $cordovaCamera) {

            var log = $logService.log;
            log('mapToolsView directive init');

            return {
                restrict: 'E',
                scope: {},
                templateUrl: 'templates/directive.map-tools-view.html',
                link: link
            }

            function link($scope) {
                $scope.openClick = function(id) {
                    if (!id) id = 0;
                    log('openClick()');
                    $commService.emit('openItem', id);
                }
                $scope.centerMap = function(p) {
                    if (!p) p = {};
                    log('centerMap()');
                    $commService.emit('centerMap', p);
                }
                $scope.openCamera = function() {
                    var options = $acgoSettings.camera();
                    log('camera options', options, true);

                    $cordovaCamera.getPicture(options).then(function(imageDataURL) {
                        log('imageDataURL', imageDataURL);

                        if (imageDataURL) {
                            // picture received!
                            $scope.imgURI = "data:image/jpeg;base64," + imageDataURL;
                        } else {
                            $scope.imgURI = null;
                        }
                    }, function(err) {
                        // An error occured. 
                        $scope.imgURI = null;
                        log('error getting picture', err, true);
                    });
                }
            }

        }
    ]);

/*
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
        }*/