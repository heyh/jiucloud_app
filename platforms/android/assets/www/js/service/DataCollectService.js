/**
 * Created by heyh on 16/8/2.
 */
angular.module('DataCollect.services', ['util.http', 'util.localStorage'])
    .service('DataCollectService', function ($window, $q, http, localStorage, $ionicPopup, $ionicLoading, $translate, reqConfig, $interval, $log, $state, $timeout,
                                             $ionicViewSwitcher, configUtil) {
        return {

            /**
             * 获取数据列表
             * @param _id
             * @param currentPage
             * @param limitSize
             * @returns {*}
             */
            getFieldDataList: function (rightList, uid, cid, type, currentPage, limitSize, keyword, advancedSearchData) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                var params = {rightList: rightList, uid: uid, cid: cid, type: type, currentPage: currentPage, limitSize: limitSize,
                    keyword: keyword,
                    advancedSearchProjectName: advancedSearchData.projectText,
                    advancedSearchCostType: advancedSearchData.costType,
                    advancedSearchStartTime: advancedSearchData.startTime,
                    advancedSearchEndTime: advancedSearchData.endTime
                };
                http.request('/api/securi_fieldDataList', params)
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

            delData: function (id) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                var params = {id: id};
                http.request('/api/securi_delFieldData', params)
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
