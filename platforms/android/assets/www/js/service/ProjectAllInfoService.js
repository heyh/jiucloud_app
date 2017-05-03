/**
 * Created by heyh on 16/8/2.
 */
angular.module('ProjectAllInfo.services', ['util.http', 'util.localStorage'])
    .service('ProjectAllInfoService', function ($window, $q, http, localStorage, $ionicPopup, $ionicLoading, $translate, reqConfig, $interval, $log, $state, $timeout,
                                         $ionicViewSwitcher, configUtil, fileUtil) {
        return {

            /**
             * 获取工程信息
             * @param mdbPath
             * @returns {*}
             */
            getProjectInfo: function (mdbPath) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                var params = {mdbPath: mdbPath};
                http.request('/api/securi_getProjectInfo', params)
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
             * 获取分部分项
             * @param uid
             * @param cid
             * @returns {*}
             */
            getProjectDataInfo: function (mdbPath) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                var params = {mdbPath: mdbPath};
                http.request('/api/securi_getProjectDataInfo', params)
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
             * 工料换算
             * @param mdbPath
             * @param pointNo
             * @returns {*}
             */
            getProjectMachineInfo: function (mdbPath, pointNo) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                var params = {mdbPath: mdbPath, pointNo: pointNo};
                http.request('/api/securi_getProjectMachineInfo', params)
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
             * 措施项目
             * @param mdbPath
             * @returns {*}
             */
            getCSInfo: function (mdbPath) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                var params = {mdbPath: mdbPath};
                http.request('/api/securi_getCSInfo', params)
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
             * CS1BL
             * @param mdbPath
             * @returns {*}
             */
            getCS1BLInfo: function (mdbPath) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                var params = {mdbPath: mdbPath};
                http.request('/api/securi_getCS1BLInfo', params)
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
             * 其它项目
             * @param mdbPath
             * @returns {*}
             */
            getQTInfo: function (mdbPath) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                var params = {mdbPath: mdbPath};
                http.request('/api/securi_getQTInfo', params)
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
             * 其它项目详情
             * @param mdbPath
             * @param pointNo
             * @param jsgs
             * @returns {*}
             */
            getQTDetailInfo: function (mdbPath, pointNo, jsgs) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                var params = {mdbPath: mdbPath, pointNo: pointNo, jsgs: jsgs};
                http.request('/api/securi_getQTDetailInfo', params)
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
             * 取费
             * @param mdbPath
             * @returns {*}
             */
            getSummaryInfo: function (mdbPath) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                var params = {mdbPath: mdbPath};
                http.request('/api/securi_getSummaryInfo', params)
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
             * 取费 SUMMARYBL
             * @param mdbPath
             * @returns {*}
             */
            getSummaryBLInfo: function (mdbPath) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                var params = {mdbPath: mdbPath};
                http.request('/api/securi_getSummaryBLInfo', params)
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
             * 计价程序 QFGS
             * @param mdbPath
             * @returns {*}
             */
            getQFGSInfo: function (mdbPath) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                var params = {mdbPath: mdbPath};
                http.request('/api/securi_getQFGSInfo', params)
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
             * 调市场价
             * @param mdbPath
             * @returns {*}
             */
            getGLJFJB: function (mdbPath) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                var params = {mdbPath: mdbPath};
                http.request('/api/securi_getGLJFJB', params)
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
             * 类别设置 RATETABLE
             * @param mdbPath
             * @returns {*}
             */
            getRatetableInfo: function (mdbPath) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                var params = {mdbPath: mdbPath};
                http.request('/api/securi_getRatetableInfo', params)
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
