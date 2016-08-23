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
      targetWidth: 300,
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

  $scope.getLocation = function() {

    var options = {
      timeout: 5000,
      enableHighAccuracy: true,
    }
    $cordovaGeolocation.getCurrentPosition(options).then(function(position) {
        console.log(position);
        $scope.position = position.coords.latitude + ', ' + position.coords.longitude + ', accuracy: ' + position.coords.accuracy;
      },
      function(err) {
        alert(err.message);
        console.error(err);
      });
  }


});