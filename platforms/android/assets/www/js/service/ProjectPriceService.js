/**
 * Created by heyh on 16/8/2.
 */
angular.module('ProjectPrice.services', ['util.http', 'util.localStorage'])
    .service('ProjectPriceService', function ($window, $q, http, localStorage, $ionicPopup, $ionicLoading, $translate, reqConfig, $interval, $log, $state, $timeout,
                                         $ionicViewSwitcher, configUtil, fileUtil) {
        return {

            /**
             * 获取项目
             * @param uid
             * @param cid
             * @returns {*}
             */
            getZjsprojects: function (uid, cid, currentPage, limitSize, keyword, searchData) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                var params = {uid: uid, cid: cid, currentPage: currentPage, limitSize: limitSize, keyword: keyword, startTime: searchData.startTime, endTime: searchData.endTime};
                http.request('/api/securi_getZjsprojects', params)
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

            getChildZjsprojects: function (id) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                var params = {id: id};
                http.request('/api/securi_getChildZjsprojects', params)
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

            getProjectMdbPath: function (userId, fileName) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                var params = {userId: userId, fileName: fileName};
                http.request('/api/securi_getProjectMdbPath', params)
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
            }
        }
    });
