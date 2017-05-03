/**
 * Created by heyh on 16/8/2.
 */
angular.module('Discuss.services', ['util.http', 'util.localStorage'])
    .service('DiscussService', function ($window, $q, http, localStorage, $ionicPopup, $ionicLoading, $translate, reqConfig, $interval, $log, $state, $timeout,
                                             $ionicViewSwitcher, configUtil) {
        return {

            discussShow: function (uid, discussType, discussId) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                var params = {uid: uid, discussType: discussType, discussId: discussId};
                http.request('/api/securi_discussShow', params)
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
            addDiscuss: function (discussType, discussId, content, uid) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                var params = {createUser: uid, discussType: discussType, discussId: discussId, content: content};
                http.request('/discussController/securi_addDiscuss', params)
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
