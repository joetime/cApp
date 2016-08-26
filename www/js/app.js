// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter',
  // dependencies
  ['ionic',
    'starter.controllers',
    'starter.services',
    'ngCordova',
    'backand'
  ])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
  })
  // Configure the error handler
  .config(function($provide) {
    $provide.decorator('$exceptionHandler', ['$log', '$delegate', '$injector',
      function($log, $delegate, $injector) {

        console.info('exceptionHandler init');

        return function(exception, cause) {

          // get the audit service
          var $errorService = $injector.get("$errorService");

          // get the current url
          var url = window.location.href;

          // log to server
          $errorService.log(exception, url, cause);

          // pass on the error (does not resolve, keeps throwing)
          $delegate(exception, cause);

          console.info('Logged error to server:', {
            exception: exception,
            cause: cause
          });
        };
      }
    ]);
  });