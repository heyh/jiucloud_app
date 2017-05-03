/**
 * Created by heyh on 16/8/2.
 */
angular.module('ProjectData.services', ['util.http', 'util.localStorage'])
    .service('ProjectDataService', function ($window, $q, http, localStorage, $ionicPopup, $ionicLoading, $translate, reqConfig, $interval, $log, $state, $timeout,
                                         $ionicViewSwitcher, configUtil, fileUtil) {
        return {

            /**
             * 获取项目
             * @param uid
             * @param cid
             * @returns {*}
             */
            getZjsprojects: function (uid, cid, currentPage, limitSize, keyword) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                var params = {uid: uid, cid: cid, currentPage: currentPage, limitSize: limitSize, keyword: keyword};
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
            }
        }
    });
