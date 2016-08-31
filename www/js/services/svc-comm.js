angular.module('starter.services').service('$commService', ['$logService', function($logService) {

    var log = $logService.log;
    log('commService init');

    var listeners = {
        'openItem': [],
        'centerMap': []
    };

    return {
        listen: listen,
        emit: emit
    }

    function listen(eventName, callback) {
        if (!listeners[eventName]) listeners[eventName] = [];
        listeners[eventName].push(callback);
    }

    function emit(eventName, params) {
        log('$commService emit: []' + eventName + ']', params)
        angular.forEach(listeners[eventName], function(callback) {
            callback(params)
        });
    }

}]);