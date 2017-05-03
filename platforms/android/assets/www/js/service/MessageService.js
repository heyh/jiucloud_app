angular.module('Message.services', ['util.http', 'util.localStorage', 'UserDeviceRelService.services'])
    .service('MessageService', function ($window, $q, http, localStorage, $ionicPopup, $ionicLoading, $translate, reqConfig, $interval, $log, $state, $timeout,
                                       $ionicViewSwitcher, configUtil) {
        return {
            getNeedApproveList: function (uid) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                $ionicLoading.show({
                    template: '查询中,请稍候...',
                    duration: reqConfig.loadingDuration
                });
                http.request('/api/securi_getNeedApproveList', {uid: uid})
                    .success(function (data) {
                        if (data.rspCode == '0000') {
                            $ionicLoading.hide();
                            deferred.resolve(data);
                        } else {
                            $ionicLoading.show({
                                template: data.data,
                                duration: reqConfig.loadingDuration
                            });
                            deferred.reject(data);
                        }
                    })
                    .error(function (data) {
                        $ionicLoading.show({
                            template: '网络异常',
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
