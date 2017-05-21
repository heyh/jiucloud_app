/**
 * Created by heyh on 16/8/2.
 */

angular.module('ApprovalDetails.services', ['util.http', 'util.localStorage'])
    .service('ApprovalDetailsService', function ($window, $q, http, localStorage, $ionicPopup, $ionicLoading, $translate, reqConfig, $interval, $log, $state, $timeout,
                                             $ionicViewSwitcher, configUtil) {
        return {
            approvedField: function (id, approvedState, approvedOption, currentApprovedUser) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                var params = {id: id, approvedState: approvedState, approvedOption: approvedOption, currentApprovedUser: currentApprovedUser};
                http.request('/api/securi_approvedField', params)
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
