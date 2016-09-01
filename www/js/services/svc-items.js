angular.module('starter.services').service('$itemService',

    function($logService, $http) {

        var log = $logService.log;
        log('$itemService init');

        var actions = {
            empty: empty,
            save: save,
            get: get
        }

        var count = 1; // increment for labels

        function empty() {
            return {
                overlayType: "marker",
                points: null,
                label: "Item " + count++,

                type: "Failure",
                immediateNeed: false,
                quantity: 1,
                unit: "EA",

                material: "",
                cause: "",
                recommendation: "",
                followUp: "",
                comments: "",

                photo1: "",
                photo2: "",
                photo3: "",
                photo4: "",
            }
        }

        var url = 'https://api.backand.com:443/1/objects/items';

        function save(item, callback) {
            log('saving...', item);
            if (item.id)
                $http.put(url + '/' + item.id + '?returnObject=true', item).then(function(d) {
                    console.log('updated', d.data);
                    if (callback) callback(d.data);
                });
            else
                $http.post(url + '?returnObject=true', item).then(function(d) {
                    log('saved', d.data);
                    if (callback) callback(d.data);
                });
        }

        function get(params, callback) {
            console.log('getting...');
            // params will be for filtering
            if (!params) params = {};
            if (!params.filter) params.filter = [];

            // adds the delete filter by default
            params.pageSize = 10;
            params.filter.push({
                fieldName: "deleted",
                operator: "equals",
                value: false
            });

            // send request
            $http({
                method: "GET",
                url: url,
                params: params
            }).then(function(d) {
                console.log('got', d.data);
                if (callback) callback(d.data.data, d.data);
            });
        }

        return actions;

    });