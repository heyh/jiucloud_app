/**
 * Created by Stomic on 15/12/25.
 */
angular.module('UserDeviceRelService.services', ['util.http', 'util.localStorage'])
    .service('UserDeviceRelService', function ($q, http, localStorage) {
        return {
            addOrUpdate: function () {
                var deferred = $q.defer();
                var promise = deferred.promise;
                var registrationId = localStorage.getItem("dt");
                if (!registrationId || registrationId == '') {
                    return;
                }
                var isDTSync = (localStorage.getItem("isDTSync") ? (localStorage.getItem("isDTSync") == "1" ? true : false) : false);
                if (registrationId && !isDTSync) {
                    http.request('userDeviceRel/addOrUpdate', {
                        registrationId: registrationId,
                        userId: (localStorage.getUser() ? JSON.parse(localStorage.getUser())['userId'] : '')
                    })
                        .success(function (_data) {
                            if (_data.rspCode == '0000') {
                                localStorage.setItem("isDTSync", 1);
                                deferred.resolve(_data);
                            } else {
                                deferred.reject(_data);
                            }
                        })
                        .error(function (error) {
                            deferred.reject(error);
                        });
                }
                return promise;
            },
            getUserInfoByUserId: function (userId) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                if (!userId || userId == '') {
                    return;
                }
                http.request('userInfo/getUserInfoByUserId', {userId: userId})
                    .success(function (_data) {
                        if (_data.data) {
                            deferred.resolve(_data.data);
                        } else {
                            deferred.reject(_data);
                        }
                    })
                    .error(function (error) {
                        deferred.reject(error);
                    });
                return promise;
            }
        }
    });
