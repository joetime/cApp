angular.module('starter')
    .directive('mapToolsView', ['$logService', '$commService', '$acgoSettings', '$cordovaCamera', '$itemService', '$window', '$gMapService',

        function($logService, $commService, $acgoSettings, $cordovaCamera, $itemService, $window, $gMapService) {

            var log = $logService.log;
            log('mapToolsView directive init');

            var pristineItem = null;

            return {
                restrict: 'E',
                scope: {},
                templateUrl: 'templates/directive.map-tools-view.html',
                link: link
            }

            function link($scope) {
                $scope.openClick = openClick;

                $scope.mapModeClick = function(mode) {
                    $commService.emit('mapDrawingMode', mode);
                }
                $scope.currentMapMode = function() {
                    //console.log('get map mode...')
                    return $gMapService.currentDrawingMode();
                }
                $scope.centerMap = centerMap;

                $scope.openCamera = openCamera;
                $scope.saveItem = saveItem;
                $scope.deleteItem = deleteItem;

                $commService.listen('editItem', function(item) {
                    pristineItem = item;
                    $scope.editingItem = item;
                })

                $scope.allItems = [];
                $itemService.get({}, function(lst, meta) {
                    $scope.totalRows = meta.totalRows;
                    $scope.allItems = lst;
                });

                $scope.listItemClick = function(item) {
                    $commService.emit('editItem', item);
                };

                $scope.closeItem = function(item) {
                    $scope.editingItem = null;
                };

                function centerMap(p) {
                    $scope.centering = true;
                    if (!p) p = {};

                    $commService.emit('centerMap', p);
                }

                function openCamera() {
                    var options = $acgoSettings.camera();
                    log('camera options', options, true);

                    $cordovaCamera.getPicture(options).then(function(imageDataURL) {
                        log('imageDataURL', imageDataURL);

                        if (imageDataURL) {
                            // picture received!
                            $scope.imageURI = "data:image/jpeg;base64," + imageDataURL;
                        } else {
                            $scope.imageURI = null;
                        }
                    }, function(err) {
                        // An error occured. 
                        $scope.imageURI = null;
                        log('error getting picture', err, true);
                    });
                }

                function saveItem() {
                    $itemService.save($scope.editingItem);
                }

                function deleteItem() {
                    if ($window.confirm('Are you sure?')) {
                        $scope.editingItem.deleted = true;
                        $itemService.save($scope.editingItem)
                        $scope.editingItem = null;
                    };
                }
            }

            function openClick(id) {
                if (!id) id = 0;
                log('openClick()');
                $commService.emit('openItem', id);
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