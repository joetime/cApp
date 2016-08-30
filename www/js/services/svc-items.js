angular.module('starter.services').service('$itemService', function($logService) {

    var log = $logService.log;
    log('$itemService init');

    var empty = {
        label: '',
        overlayType: '',
        overlay: {},
        immediate: false,
        photo: null,
        comments: ''
    };

    return {
        empty: empty
    }
});