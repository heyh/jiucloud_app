/**
 * Created by Stomic on 2015/12/6.
 */
angular.module('httpConfig', [])
    .factory('reqConfig', function ($window) {
        // var serIp = "http://gcgl.9393915.com:8080/jiucloud";
        var serIp = "http://127.0.0.1:8080/jiucloud";
        return {
            host: serIp,
            captureResendInterval: 60,
            photoPerRow: 2,
            uploadUrl: serIp + "/api/securi_upload",
            loadingDuration: 1000,
            docDir:"",
            imgTempDir: "tmpImage",
            maxRequestTimes: 5,
            isSyncServerFile: false
        }
    });
