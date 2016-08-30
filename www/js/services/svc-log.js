angular.module('starter.services').service('$logService', function($errorService) {

    var logs = [];
    var listeners = [];

    window.onerror = function(message, url, lineNumber) {

        log(message, {
            url: url,
            lineNumber: lineNumber
        });
        //save error and send to server for example.
        return true;
    };

    return {
        log: log,
        logs: logs,
        listen: listen
    };

    // add log to the list, then call all the listeners
    function log(msg, obj, server) {

        if (obj)
            console.log(msg, obj);
        else
            console.log(msg);

        // insert logs at front of list
        logs.splice(0, 0, {
            msg: msg,
            object: obj
        });

        // limit the list to 25 items
        if (logs.length > 25)
            logs = logs.splice(0, 25);

        // let everyone know the log has been updated
        angular.forEach(listeners, function(listener) {
            listener(logs);
        });

        // try logging to server
        try {
            if (server) {
                $errorService.logOther(msg, obj);
            }
        } catch (err) {
            // nothing
        }
    }

    // add a function to the listeners list
    function listen(fn) {
        listeners.push(fn);
    }
})