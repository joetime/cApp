angular.module('starter.services').service('$optionsService', function() {

    var categoryOptions = [
        'Failure',
        'ADA',
        'Core',
        'Other'
    ];

    return {
        categories: categoryOptions
    }
});