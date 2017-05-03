/**
 * Created by heyh on 16/8/2.
 */
angular.module('DataAdd.services', ['util.http', 'util.localStorage'])
    .service('DataAddService', function ($window, $q, http, localStorage, $ionicPopup, $ionicLoading, $translate, reqConfig, $interval, $log, $state, $timeout,
                                         $ionicViewSwitcher, configUtil, fileUtil) {
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
             * 获取标段信息
             * @param cid
             * @param uid
             * @param projectId
             * @returns {*}
             */
            getSectionInfos: function (cid, uid, projectId) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                var params = {cid: cid, uid: uid, projectId: projectId};
                http.request('/api/securi_getSelectItems', params)
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
             * 标段附加信息
             * @param cid
             * @param uid
             * @param projectId
             * @returns {*}
             */
            getSupInfo: function(cid, uid, projectId, section) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                var params = {cid: cid, uid: uid, projectId: projectId, section: section};
                http.request('/api/securi_getSupInfo', params)
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
             * 添加数据
             * @param fieldData
             * @returns {*}
             */
            addData: function (fieldData) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                $ionicLoading.show({
                    template: '正在提交,请稍候...',
                    duration: reqConfig.loadingDuration
                });
                http.request('/api/securi_savefieldData', fieldData)
                    .success(function (data) {
                        if (data.rspCode == '0000') {
                            $ionicLoading.show({
                                template: '添加成功',
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

            /**
             * 上传附件
             * @param imageList
             * @param params
             * @returns {*}
             */
            uploadFiles: function (imageList, params) {
                return fileUtil.uploadFiles(imageList, reqConfig.uploadUrl, params);
            },

            /**
             * 取最近的 projectId
             * @returns {*}
             */
            getMaxFieldData: function (cid, uid) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                var params = {cid: cid, uid: uid};
                http.request('/api/securi_getMaxFieldData', params)
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
