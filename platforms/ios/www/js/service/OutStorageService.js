/**
 * Created by heyh on 16/8/2.
 */
angular.module('OutStorage.services', ['util.http', 'util.localStorage'])
    .service('OutStorageService', function ($window, $q, http, localStorage, $ionicPopup, $ionicLoading, $translate, reqConfig, $interval, $log) {
        return {
            /**
             * 出库
             * @param fieldData
             * @returns {*}
             */
            outStorage: function (uid, fieldData) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                $ionicLoading.show({
                    template: '正在提交,请稍候...',
                    duration: reqConfig.loadingDuration
                });
                http.request('/api/securi_saveOutFieldData', {uid:uid, outProId:fieldData.outProId, outCount: fieldData.outCount, id: fieldData.id })
                    .success(function (data) {
                        if (data.rspCode == '0000') {
                            $ionicLoading.show({
                                template: '出库成功',
                                duration: reqConfig.loadingDuration
                            });
                            deferred.resolve(data);
                        } else {
                            $ionicLoading.show({
                                template: '添加失败',
                                duration: reqConfig.loadingDuration
                            });
                            deferred.reject(data);
                        }
                    })
                    .error(function (data) {
                        $ionicLoading.show({
                            template: '添加失败',
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

            getStorageCount: function (id) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                var params = {id: id};
                http.request('/api/securi_getStorageCount', params)
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
