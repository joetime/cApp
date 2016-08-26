angular.module('starter.services')
    .service('$errorService', function($http, Backand) {

        var endpointUrl = 'https://api.backand.com/1/objects/exceptions/';

        logError = function(ex, url, cause, isTest) {

            isTest = isTest || false;

            var exString = 'JSON:' + JSON.stringify(ex);

            var record = {
                //"timeStamp": timeStamp,
                "type": "ERROR",
                "exception": exString,
                "url": url,
                "cause": cause,
                "isTest": isTest
            };

            return $http.post(endpointUrl, record);
        }

        logOther = function(msg, obj) {
            obj = JSON.stringify(obj);
            var record = {
                "type": "LOG",
                "exception": obj,
                "url": msg
            };
            return $http.post(endpointUrl, record);
        }

        test = function() {
            return logError('test exception', 'test url', 'test cause', true);
        }

        return {
            log: logError,
            logOther: logOther,
            test: test
        }
    });