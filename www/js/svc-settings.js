angular.module('starter').service('$acgoSettings', ['$cordovaCamera', '$logService',
    function($cordovaCamera, $logService) {

        var log = $logService.log;

        var defaults = {
            camera: {
                quality: 50,
                //allowEdit: true,
                targetWidth: 960,
                targetHeight: 640,
                saveToPhotoAlbum: false,
                //correctOrientation: true
            },
            geolocation: {
                timeout: 5000,
                enableHighAccuracy: true,
            },
            mapDefaultPosition: {
                center: {
                    lat: 34.397,
                    lng: -95.644
                },
                zoom: 4
            }
        };


        try {
            var c = Camera; // will fail if no Camera is defined

            log('setting additional camera defaults');
            defaults.camera.destinationType = c.DestinationType.DATA_URL;
            //defaults.camera.destinationType = c.DestinationType.FILE_URI;
            defaults.camera.sourceType = c.PictureSourceType.CAMERA;
            defaults.camera.encodingType = c.EncodingType.JPEG;
            defaults.camera.popoverOptions = CameraPopoverOptions;

        } catch (err) {
            log('Camera not available on this device.')
        }

        return {
            allSettings: function() {
                return defaults;
            },
            camera: function() {
                try {
                    var c = Camera;
                } catch (err) {
                    alert('Camera not available on this device.', null, 'Device error', 'OK fine.')
                    return {};
                }
                return defaults.camera;
            },
            geolocation: function() {
                return defaults.geolocation
            },
            mapDefaultPosition: function() {
                return defaults.mapDefaultPosition
            }
        }
    }
]);