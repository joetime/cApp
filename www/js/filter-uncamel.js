angular.module('starter').filter('unCamel', function() {
    return function(str, params) {
        if (!str || str.length == 0) return item;
        var newStr = '';
        for (var i = 0; i < str.length; i++) {
            var letter = str[i];
            // capitalize first letter
            if (i == 0)
                newStr += letter.toUpperCase();
            // add space before other capitals
            else if (letter == letter.toUpperCase())
                newStr += ' ' + letter;
            // just use letter
            else
                newStr += letter;
        };
        return newStr;
    }
})