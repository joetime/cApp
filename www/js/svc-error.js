angular.module('starter')
    .service('$errorService', function($http, Backand) {

        var endpointUrl = 'https://api.backand.com/1/objects/exceptions/';

        logError = function(ex, url, cause, isTest) {

            isTest = isTest || false;

            var timeStamp = new Date();

            var record = {
                //"timeStamp": timeStamp,
                "exception": ex,
                "url": url,
                "cause": cause,
                "isTest": isTest
            }

            //log('logging error: ', record);

            return $http.post(endpointUrl, record);
        }

        test = function() {
            return logError('test exception', 'test url', 'test cause', true);
        }

        return {
            log: logError,
            test: test
        }
    });