angular.module('starter').filter('fromNow', function() {

    return function(str, param) {
        if (!str || str.length == 0) return '';

        return moment(str).fromNow();
    }
});

angular.module('starter').filter('local', function() {

    return function(str, param) {
        if (!str || str.length == 0) return '';

        return moment(str).local();
    }
});