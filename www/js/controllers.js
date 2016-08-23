angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
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

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})

.controller("ExampleCtrl", function($scope, $cordovaCamera, $cordovaGeolocation) {

  // Access Camera
  $scope.takePicture = function() {

    try {
      var c = Camera;
    } catch (err) {
      alert('Camera not available on this device.', null, 'Device error', 'OK fine.')
      return;
    }

    var options = {
      quality: 75,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 400,
      targetHeight: 300,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.imgURI = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // An error occured. Show a message to the user
    });
  }

  // Access Geolocation
  $scope.getLocation = function() {

    var options = {
      timeout: 5000,
      enableHighAccuracy: true,
    };

    $cordovaGeolocation.getCurrentPosition(options).then(function(position) {
        console.log(position);
        $scope.position = position.coords.latitude + ', ' + position.coords.longitude + ', accuracy: ' + position.coords.accuracy;
      },
      function(err) {
        alert(err.message);
        console.error(err);
      });
  }


})

.controller("MapCtrl", function($scope, $cordovaCamera, $cordovaGeolocation) {

  // entire US
  var defaultPosition = {
    center: {
      lat: 34.397,
      lng: -95.644
    },
    zoom: 4
  };
  var geolocationOptions = {
    timeout: 5000,
    enableHighAccuracy: true,
  };


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
        console.log('could not get position')
      });
  }
  init();




});