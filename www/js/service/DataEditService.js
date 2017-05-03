/**
 * Created by heyh on 16/8/2.
 */
angular.module('DataEdit.services', ['util.http', 'util.localStorage'])
    .service('DataEditService', function ($window, $q, http, localStorage, $ionicPopup, $ionicLoading, $translate, reqConfig, $interval, $log, $state, $timeout,
                                         $ionicViewSwitcher, configUtil) {
        return {
            /**
             * 获取项目列表
             * @param cid
             * @returns {*}
             */
            getProjects: function (cid, uid) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                var params = {cid: cid, uid: uid};
                http.request('/api/securi_getProjects', params)
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

            /**
             * 获取费用类型
             * @returns {*}
             */
            getCostInfos: function (uid, cid, type) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                var params = {uid: uid, cid: cid, type: type};
                http.request('/api/securi_getCostInfos', params)
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

            /**
             * 获取单位
             * @returns {*}
             */
            getUnitParams: function () {
                var deferred = $q.defer();
                var promise = deferred.promise;
                var params = {paramType: 'UP'};
                http.request('/api/securi_getParams', params)
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

            /**
             * 修改记录
             * @param filedData
             * @returns {*}
             */
            editData: function (filedData) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                $ionicLoading.show({
                    template: '正在提交,请稍候...',
                    duration: reqConfig.loadingDuration
                });
                http.request('/api/securi_editFieldData', filedData)
                    .success(function (data) {
                        if (data.rspCode == '0000') {
                            $ionicLoading.show({
                                template: '修改成功',
                                duration: reqConfig.loadingDuration
                            });
                            deferred.resolve(data);
                        } else {
                            $ionicLoading.show({
                                template: '修改失败',
                                duration: reqConfig.loadingDuration
                            });
                            deferred.reject(data);
                        }
                    })
                    .error(function (data) {
                        $ionicLoading.show({
                            template: '修改失败',
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

            /**
             * 删除附件
             * @param id
             * @returns {*}
             */
            delFile: function (id) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                var params = {id: id};
                http.request('/api/securi_delFile', params)
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
