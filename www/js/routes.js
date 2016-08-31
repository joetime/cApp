angular.module('starter')
    .config(function($stateProvider, $urlRouterProvider) {

        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider

        // setup an abstract state for the tabs directive
            .state('tab', {
            url: '/tab',
            abstract: true,
            templateUrl: 'templates/tabs.html'
        })

        // Each tab has its own nav history stack:

        .state('tab.dash', {
                url: '/dash',
                views: {
                    'tab-dash': {
                        templateUrl: 'templates/tab-dash.html',
                        controller: 'DashCtrl'
                    }
                }
            })
            .state('tab.systemtests', {
                url: '/systemtests',
                views: {
                    'tab-systemtests': {
                        templateUrl: 'templates/tab-systemtests.html',
                        controller: 'SystemTestsCtrl'
                    }
                }
            })
            .state('tab.map', {
                url: '/map',
                views: {
                    'tab-map': {
                        templateUrl: 'templates/tab-map.html',
                        controller: 'MapCtrl'
                    }
                }
            })
            .state('tab.map-detail', {
                url: '/map/:itemId',
                views: {
                    'tab-map': {
                        templateUrl: 'templates/map-detail.html',
                        controller: 'MapDetailCtrl'
                    }
                }
            })

        .state('tab.chats', {
                url: '/chats',
                views: {
                    'tab-chats': {
                        templateUrl: 'templates/tab-chats.html',
                        controller: 'ChatsCtrl'
                    }
                }
            })
            .state('tab.chat-detail', {
                url: '/chats/:chatId',
                views: {
                    'tab-chats': {
                        templateUrl: 'templates/chat-detail.html',
                        controller: 'ChatDetailCtrl'
                    }
                }
            })

        .state('tab.settings', {
                url: '/settings',
                views: {
                    'tab-settings': {
                        templateUrl: 'templates/tab-settings.html',
                        controller: 'SettingsCtrl'
                    }
                }
            })
            .state('tab.logs', {
                url: '/logs',
                views: {
                    'tab-logs': {
                        templateUrl: 'templates/tab-logs.html',
                        controller: 'LogsCtrl'
                    }
                }
            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/tab/map');

    });