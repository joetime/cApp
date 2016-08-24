//Update Angular configuration section
angular.module('starter').config(function(BackandProvider) {
    BackandProvider.setAppName('acgo');
    BackandProvider.setSignUpToken('26162e7b-934a-42ea-bd44-8e8e73eab36e');
    BackandProvider.setAnonymousToken('f53fd52e-dec6-41c8-93b4-daef813ebdbe');
})

.service('$dataService', function($http, Backand) {

    var baseUrl = '/1/objects/';
    var objectName = 'Test/';

    function getUrl() {
        return Backand.getApiUrl() + baseUrl + objectName;
    }

    function getUrlForId(id) {
        return getUrl() + id;
    }

    test = function() {
        var url = Backand.getApiUrl() + baseUrl + 'Test/1'
        return $http.get(url);
    }

    getTodos = function() {
        return $http.get(getUrl());
    };

    getTodo = function(id) {
        return $http.get(getUrlForId(id));
    }

    addTodo = function(todo) {
        return $http.post(getUrl(), todo);
    }

    deleteTodo = function(id) {
        return $http.delete(getUrlForId(id));
    };

    return {
        test: test,
        getTodo: getTodo,
        getTodos: getTodos,
        addTodo: addTodo,
        deleteTodo: deleteTodo
    }
})

.service('$fileUploadService', function() {

    var actionUrl = "https://api.backand.com/1/objects/action/Test/?name=file"

    function upload(filename, filedata) {
        // By calling the files action with POST method in will perform 
        // an upload of the file into Backand Storage

        log('upload filename', filename)
        log('upload filedata', filedata);

        return $http({
            method: 'POST',
            url: actionUrl, //Backand.getApiUrl() + baseActionUrl +  objectName,
            params: {
                "name": filesActionName
            },
            headers: {
                'Content-Type': 'application/json'
            },
            // you need to provide the file name and the file data
            data: {
                "filename": filename,
                "filedata": filedata.substr(filedata.indexOf(',') + 1, filedata.length) //need to remove the file prefix type
            }
        });
    };

    return {
        doUpload: upload
    }

})