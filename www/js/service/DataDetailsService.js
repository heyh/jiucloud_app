/**
 * Created by heyh on 16/8/2.
 */

angular.module('DataDetails.services', ['util.http', 'util.localStorage'])
    .service('DataDetailsService', function ($window, $q, http, localStorage, $ionicPopup, $ionicLoading, $translate, reqConfig, $interval, $log, $state, $timeout,
                                             $ionicViewSwitcher, configUtil, fileUtil, $filter) {
        return {
            getFileList: function (mid) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                var params = {mid: mid};
                http.request('/api/securi_fileList', params)
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

            /*get local files*/
            getLocalDocs:function(){
                var deferred = $q.defer();
                var promise = deferred.promise;
                fileUtil.getFilesInDir("",LocalFileSystem.PERSISTENT).then(function (entries) {
                    var total = 0,fileList = [];
                    var fileEntries = _.chain(entries||[]).reduce(function(memo,entry){
                        if(entry.isFile){
                            memo.push(entry)
                        }
                        return memo;
                    },[]).value();
                    $.each(fileEntries, function (index, ele) {
                        if (ele.isFile) {
                            ele.file(function (fileObj) {
                                total++;
                                fileList.push({
                                    fileName: fileObj.name,
                                    fileUrl: cordova.file.documentsDirectory + fileObj.name,
                                    fileSize: fileObj.size,
                                    lastModified: $filter('date')(new Date(fileObj.lastModified), "yyyy-MM-dd HH:mm:ss")
                                });
                                if (total == fileEntries.length) {
                                    deferred.resolve(fileList);
                                }
                            });
                        }
                    });
                }, function (error) {
                    deferred.reject(error);
                });
                return promise;
            }
        }
    });
