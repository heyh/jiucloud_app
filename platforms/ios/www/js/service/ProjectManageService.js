/**
 * Created by heyh on 16/8/2.
 */

angular.module('ProjectManage.services', ['util.http', 'util.localStorage', 'UserDeviceRelService.services'])
    .service('ProjectManageService', function ($window, $q, http, localStorage, $ionicPopup, $ionicLoading, $translate, reqConfig, $interval, $log, $state, $timeout,
                                               $ionicViewSwitcher, configUtil) {
        return {
            getAd: function () {
                var deferred = $q.defer();
                var promise = deferred.promise;
                var params = {picType: '0'};
                http.request('/api/securi_getAd', params)
                    .success(function (data) {
                        if (data.rspCode == '0000') {
                            deferred.resolve(data);
                        } else {
                            $ionicLoading.show({
                                template: '网络异常',
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
            },
        }
    });
