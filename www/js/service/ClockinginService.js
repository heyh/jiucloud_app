angular.module('Clockingin.services', ['util.http', 'util.localStorage'])
    .service('ClockinginService', function ($window, $q, http, localStorage, $ionicPopup, $ionicLoading, $translate, reqConfig, $interval, $log, $state, $timeout,
                                       $ionicViewSwitcher, configUtil) {
        return {

            clockingin: function (clockinginData) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                $ionicLoading.show({
                    template: '处理中,请稍候...',
                    duration: reqConfig.loadingDuration
                });
                http.request('/api/securi_clockingin', clockinginData)
                    .success(function (data) {
                        if (data.rspCode == '0000') {
                            $ionicLoading.show({
                                template: '处理成功',
                                duration: reqConfig.loadingDuration
                            });
                            deferred.resolve(data);
                        } else {
                            $ionicLoading.show({
                                template: '处理失败',
                                duration: reqConfig.loadingDuration
                            });
                            deferred.reject(data);
                        }
                    })
                    .error(function (data) {
                        $ionicLoading.show({
                            template: '处理失败',
                            duration: reqConfig.loadingDuration
                        });
                        deferred.reject(data);
                    });
                promise.success = function (fn) {
                    promise.then(fn);
                    return promise;
                };
                promise.error = function (fn) {
                    promise.then(null, fn);
                    return promise;
                };
                return promise;
            }
        }
    });
