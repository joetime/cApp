angular.module('starter').filter('safeJson', function() {

    return function(obj, params) {

        var newStr = '';

        if (!obj) return newStr;

        try {
            newStr = JSON.stringify(obj);
        } catch (err) {
            newStr = '<unserializable object>';
        }

        return newStr;
    }
});