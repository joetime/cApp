angular.module('starter.controllers', [])

.controller('DashCtrl',
  function($scope, $logService) {
    var log = $logService.log;
    log('DashCtrl init');

  })

.controller('ChatsCtrl',
  function($scope, Chats, $logService) {
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
  })

.controller("SystemTestsCtrl",
  function($scope, $acgoSettings, $cordovaCamera, $cordovaGeolocation, $dataService, $logService, $errorService) {

    var log = $logService.log;
    log('SystemTestsCtrl init');


    // Access Camera
    $scope.takePicture = function() {

      var options = $acgoSettings.camera();

      $cordovaCamera.getPicture(options).then(function(imageData) {
        $scope.imgURI = "data:image/jpeg;base64," + imageData;
      }, function(err) {
        // An error occured. Show a message to the user
      });
    }

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

.controller("MapCtrl",
    function($scope, $acgoSettings, $cordovaCamera, $cordovaGeolocation, $logService) {

      var log = $logService.log;
      log('MapCtrl init');

      // entire US
      var defaultPosition = $acgoSettings.mapDefaultPosition();
      var geolocationOptions = $acgoSettings.geolocation();

      var map = new google.maps.Map(document.getElementById('map'), {
        center: defaultPosition.center,
        scrollwheel: false,
        zoom: defaultPosition.zoom
      });

      function init() {

        $cordovaGeolocation.getCurrentPosition(geolocationOptions).then(function(position) {
            var myLatlng = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            map.setCenter(myLatlng);
            map.setZoom(19);
          },
          function(err) {
            log('could not get position')
          });
      }
      init();

    })
  .controller("LogsCtrl", function($scope, $logService) {

    var log = $logService.log;
    log('LogsCtrl init');

    $scope.logs = $logService.logs;

    $logService.listen(function(logs) {
      $scope.logs = logs;
    })
  })