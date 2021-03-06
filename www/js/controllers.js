angular.module('starter.controllers', [])

.controller('DashCtrl',
  function($scope, $logService) {
    var log = $logService.log;
    log('DashCtrl init');

  })

.controller('ChatsCtrl',
  function($scope, Chats, $logService, $window) {
    var log = $logService.log;
    log('ChatsCtrl init');

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $scope.chats = Chats.all();
    $scope.remove = function(chat) {
      Chats.remove(chat);
    };

    $scope.chatClick = function(id) {
      log('navigating to chat details page...');
      $window.location.href = '#/tab/chats/' + id;
    }

  })


.controller('ChatDetailCtrl',
  function($scope, $stateParams, Chats, $logService) {
    var log = $logService.log;
    log('ChatDetailCtrl init');

    $scope.chat = Chats.get($stateParams.chatId);
  })

.controller('SettingsCtrl',
  function($scope, $acgoSettings, $logService) {
    var log = $logService.log;
    log('SettingsCtrl init');

    $scope.settings = $acgoSettings.allSettings();

    $scope.quality = $scope.settings.camera.quality;

    $scope.qualityChange = function(q) {
      $scope.quality = q;
      log('quality: ', $scope.quality);
    }

  })

.controller("SystemTestsCtrl",
  function($scope, $acgoSettings, $cordovaCamera, $cordovaGeolocation, $dataService, $logService, $fileUploadService, $errorService, $http, Backand) {

    var log = $logService.log;
    log('SystemTestsCtrl init');


    // Access Camera
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


    // Test upload files 
    $scope.uploadTest = function() {
      log('uploading test...');
      $scope.uploading = true;

      $http({
        method: 'POST',
        url: Backand.getApiUrl() + '/1/objects/action/Test/1',
        params: {
          name: 'files',
          parameters: {
            filename: 'test.txt',
            filedata: 'abcd'
          }
        },
        config: {
          ignoreError: true
        },
        data: {}
      }).then(function(d) {
          log('upload success', d, true);
          $scope.uploadResult = d;
          $scope.uploading = false;
        },
        function(err) {
          log('upload error', err, true);
          $scope.uploadResult = err;
          $scope.uploading = false;
        });
    }

    $scope.downloadTest = function() {

      log('uploading test...');
      $scope.downloading = true;

      $http({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/objects/action/Test/1',
        params: {
          name: 'files',
          parameters: {
            filename: 'test.txt',
            //filedata: 'abcd'
          }
        },
        config: {
          ignoreError: true
        },
        data: {}
      }).then(function(d) {
          log('download success', d, true);
          $scope.uploadResult = d;
          $scope.downloading = false;
        },
        function(err) {
          log('download error', err, true);
          $scope.uploadResult = err;
          $scope.downloading = false;
        });
    };

    // Access Geolocation
    $scope.getLocation = function() {

      $scope.gettingLocation = true;

      var options = $acgoSettings.geolocation();

      $cordovaGeolocation.getCurrentPosition(options).then(function(position) {
          log('geolocation success', position);
          $scope.position = position.coords.latitude + ', ' + position.coords.longitude + ', accuracy: ' + position.coords.accuracy;
          $scope.gettingLocation = false;
        },
        function(err) {
          alert(err.message);
          log('geolocation error', err);
          $scope.gettingLocation = false;
        });
    }

    // Test connection to Backand
    $scope.getData = function() {

      $scope.gettingData = true;
      $dataService.test().then(function(result) {
          log('dataService success', result);
          $scope.dataResult = result.data.Test;
          $scope.gettingData = false;
        },
        function(err) {
          log('data err', err);
          $scope.dataResult = 'ERROR: ' + (err.data || err.message || err.status);
          $scope.gettingData = false;
        });
    }

    // Test logging errors
    $scope.logError = function() {
      $scope.loggingError = true;
      $errorService.test().then(
        function(result) {
          log('error log success');
          $scope.errorResult = result;
          $scope.loggingError = false;
        },
        function(err) {
          log('error log err', err);
          $scope.errorResult = 'ERROR: ' + (err.data || err.message || err.status);
          $scope.loggingError = false;
        }
      )
    }

  })


.controller("LogsCtrl", function($scope, $logService) {

  var log = $logService.log;
  log('LogsCtrl init');

  $scope.logs = $logService.logs;

  $logService.listen(function(logs) {
    $scope.logs = logs;
  })
})