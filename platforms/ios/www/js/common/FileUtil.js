/**
 * Created by Stomic on 15/12/18.
 */
angular.module('util.fileUtil', [])
  .factory('fileUtil', function ($window, $q, $cordovaFile, $cordovaFileTransfer, $ionicLoading, reqConfig, $translate, $timeout, ttLoading) {
    return {
      /*获取dir目录下的文件列表*/
      getFilesInDir: function (dir, fileSystemType) {
        var deferred = $q.defer();
        var promise = deferred.promise;

        var _fileSystemType = (angular.isUndefined(fileSystemType) ? LocalFileSystem.PERSISTENT : fileSystemType);
        window.requestFileSystem(_fileSystemType, 0, function (fileSystem) {
          fileSystem.root.getDirectory(dir, {
            create: true,
            exclusive: false
          }, function (file) {
            // Get a directory reader
            var directoryReader = file.createReader();
            // Get a list of all the entries in the directory
            directoryReader.readEntries(function (entries) {
              deferred.resolve(entries);
            }, function (error) {
              deferred.reject(error)
            });
          }, function (error) {
            deferred.reject(error)
          });
        }, function (error) {
          deferred.reject(error)
        });
        return promise;
      },
      downloadFile: function (url, dir, isShowLoading, saveFileName) {
          var deferred = $q.defer(),me=this;
          var promise = deferred.promise;
          var fileName = url.substring(url.lastIndexOf("/")+1);
          var options = {},dic = dir || reqConfig.docDir || 'tmpData';
          var targetPath = cordova.file.documentsDirectory + (dir || reqConfig.docDir)+"/" + fileName;
          var trustHosts = true,_isShowLoading = (angular.isUndefined(isShowLoading)?true:isShowLoading);
        if (_isShowLoading) {
          $ionicLoading.show({
            template: $translate("DownLoading...")
          });
        }
        $cordovaFile.checkDir(cordova.file.documentsDirectory, dic)
          .then(function (success) {
            $cordovaFileTransfer.download(url, targetPath, options, trustHosts)
              .then(function (result) {
                if (_isShowLoading) {
                  $ionicLoading.show({
                    template: $translate("DownLoad success"),
                    duration: reqConfig.loadingDuration
                  });
                }
                deferred.resolve(fileName);
              }, function (err) {
                if (_isShowLoading) {
                  $ionicLoading.show({
                    template: $translate("DownLoad failed"),
                    duration: reqConfig.loadingDuration
                  });
                }
                deferred.reject(err);
              }, function (progress) {
                $timeout(function () {
                  if (_isShowLoading) {
                    $ionicLoading.show({
                      template: parseInt((progress.loaded / progress.total) || 0) * 100 + "%"
                    });
                    if (progress.loaded == progress.total) {
                      $ionicLoading.show({
                        template: parseInt((progress.loaded / progress.total) || 0) * 100 + "%",
                        duration: reqConfig.loadingDuration
                      });
                    }
                  }
                })
              });
          }, function (error) {
            // error
            $cordovaFile.createDir(cordova.file.documentsDirectory, dic, false)
              .then(function (success) {
                // success
                $cordovaFileTransfer.download(url, targetPath, options, trustHosts)
                  .then(function (result) {
                    if (_isShowLoading) {
                      $ionicLoading.show({
                        template: $translate("DownLoad success"),
                        duration: reqConfig.loadingDuration
                      });
                    }
                    deferred.resolve(fileName);
                  }, function (err) {
                    if (_isShowLoading) {
                      $ionicLoading.show({
                        template: $translate("DownLoad failed"),
                        duration: reqConfig.loadingDuration
                      });
                    }
                    deferred.reject(error);
                  }, function (progress) {
                    $timeout(function () {
                      if (_isShowLoading) {
                        $ionicLoading.show({
                          template: parseInt((progress.loaded / progress.total) || 0) * 100 + "%"
                        });
                        if (progress.loaded == progress.total) {
                          $ionicLoading.show({
                            template: parseInt((progress.loaded / progress.total) || 0) * 100 + "%",
                            duration: reqConfig.loadingDuration
                          });
                        }
                      }
                    })
                  });
              }, function (error) {
                // error
                deferred.reject(error);
              });
          });
        return promise;
      },
      /*
       * upload files
       * @param fileList(each object should have attribute "fileUrl" which has absolute file url)
       * @param params(additional params will pass through)
       * */
      uploadFiles: function (fileList, reqUrl, params) {
        var deferred = $q.defer();
        var promise = deferred.promise;
        if (fileList.length == 0) {
          deferred.resolve();
          return promise;
        }
        function checkFiles(_fileList) {
          var _isValid = true;
          $.each(_fileList || [], function (index, file) {
            file['fileIndex'] = index;
            if (!file['fileUrl']) {
              _isValid = false;
            }
          });
          if (!_isValid) {
              $ionicLoading.show({
                  template: $translate("Uploading attachments failed..."),
                  duration: reqConfig.loadingDuration
              });
          }
          ;
          return _isValid;
        };
        if (!checkFiles(fileList)) {
          deferred.reject();
          return promise;
        }
        /*start upload*/
        $ionicLoading.show({
          template: $translate("Uploading attachments...")
        });
        // arguments order from js: [filePath, server, fileKey, fileName, mimeType, params, debug, chunkedMode]
        var options = {params: params}, uploadStart = new Date().getTime(), uploadTimeout = new Date().getTime();
        var totalFiles = fileList.length || 0;
        var percentArray = [], successCount = 0, hasShowSuccess = false, hasShowError = false;
        $.each(fileList || [], function (index, ele) {
          if (ele && ele.hasOwnProperty("isSample")) {
            $.extend(options.params, {isSample: ele.isSample || 0});
          } else {
            $.extend(options.params, {isSample: 0});
          }
          $.extend(options, {fileName: ele.fileUrl.substring(ele.fileUrl.lastIndexOf("/") + 1)});
          $cordovaFileTransfer.upload(reqUrl, ele.fileUrl, options)
            .then(function (result) {
              successCount = successCount + 1;
              if (successCount == fileList.length) {
                if (!hasShowSuccess) {
                  hasShowSuccess = true;
                    $ionicLoading.show({
                        template: $translate("Upload success"),
                        duration: reqConfig.loadingDuration
                    });
                  deferred.resolve();
                }
              }
            }, function (err) {
              if (!hasShowError) {
                hasShowError = true;
                  $ionicLoading.show({
                      template: $translate("Upload files failed"),
                      duration: reqConfig.loadingDuration
                  });
              }
              deferred.reject();
            }, function (progress) {
              uploadTimeout = new Date().getTime();
              if (uploadTimeout - uploadStart >= reqConfig.uploadTimeout) {
                if (!hasShowError) {
                  hasShowError = true;
                    $ionicLoading.show({
                        template: $translate("Upload timeout"),
                        duration: reqConfig.loadingDuration
                    });
                }
                deferred.reject();
                return;
              }
              var isExists = false;
              $.each(percentArray, function (_index, ele) {
                if (ele.fileIndex == index) {
                  ele.percent = parseInt(((progress || {}).loaded || 0) * 100 / ((progress || {}).total || 0));
                  isExists = true;
                  return;
                }
              });
              if (!isExists) {
                percentArray.push({
                  fileIndex: index,
                  percent: parseInt(((progress || {}).loaded || 0) * 100 / ((progress || {}).total || 0))
                });
              }
              var totalPercent = 0;
              if (percentArray.length == fileList.length) {
                $.each(percentArray, function (index, ele) {
                  totalPercent = totalPercent + ele.percent;
                });
                $ionicLoading.show({
                  template: '<ion-spinner></ion-spinner><br/>' + parseInt(totalPercent / fileList.length) + "%"
                });
              } else {
                $ionicLoading.show({
                  template: '<ion-spinner></ion-spinner><br/>' + parseInt(totalPercent / fileList.length) + "%"
                });
              }
              if ((totalPercent == (100 * fileList.length)) && totalPercent != 0) {
                if (!hasShowSuccess) {
                  hasShowSuccess = true;
                    $ionicLoading.show({
                        template: $translate("Upload success"),
                        duration: reqConfig.loadingDuration
                    });
                  deferred.resolve();
                }
              }
            });
        });
        return promise;
      },
      uploadSingleFile: function (file, reqUrl, params) {
        var deferred = $q.defer();
        var promise = deferred.promise;
        var options = {params: params};

        $cordovaFileTransfer.upload(reqUrl, file, options)
          .then(function (data) {
//                  alert(JSON.stringify(data));
            $ionicLoading.hide();
            deferred.resolve(data);
          }, function (err) {
            alert("err!" + JSON.stringify(err));
            $ionicLoading.hide();
            deferred.reject(err);
          }, function (progress) {
            var totalPercent = parseInt(((progress || {}).loaded || 0) * 100 / ((progress || {}).total || 0));
            $ionicLoading.show({
              template: '<ion-spinner></ion-spinner><br/>' + parseInt(totalPercent) + "%"
            });
            if (totalPercent == 100) {
              ttLoading.saveSuccessLoading();
            }
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
       * clear cached files in tmp directory
       */
      removeTempDicFiles: function () {
        var deferred = $q.defer();
        var promise = deferred.promise;
        this.getFilesInDir("", LocalFileSystem.PERSISTENT).then(function (entries) {
          var total = 0, fileList = [];
          $.each(entries, function (index, ele) {
            ele.file(function (fileObj) {
              $cordovaFile.removeFile(cordova.file.tempDirectory, fileObj.name).then(function () {
                total++;
                if (total == entries.length) {
                  deferred.resolve(entries.length);
                }
              });
            });
          });
        }, function (error) {
          deferred.reject(error);
        });
        return promise;
      },
      /**
       * clear cached files in tmp directory
       */
      removeDicFiles: function (dir,whiteList) {
        var deferred = $q.defer();
        var promise = deferred.promise;
        this.getFilesInDir(dir, LocalFileSystem.PERSISTENT).then(function (entries) {
          var total = 0, fileList = [],entriesLength=entries.length||0;
          $.each(entries, function (index, ele) {
            ele.file(function (fileObj) {
              if(whiteList && whiteList.length > 0){
                var isFound = _.find(whiteList,function(whiteFile){
                  var fileName = whiteFile.fileUrl.substring(whiteFile.fileUrl.lastIndexOf("/") + 1)
                  if(fileName == fileObj.name){
                    entriesLength = entriesLength -1;
                    return true;
                  }
                });
                if(!isFound){
                  $cordovaFile.removeFile(cordova.file.documentsDirectory + dir, fileObj.name).then(function () {
                    total++;
                    if (total == entriesLength) {
                      deferred.resolve(entriesLength);
                    }
                  });
                }
              }else{
                $cordovaFile.removeFile(cordova.file.documentsDirectory + dir, fileObj.name).then(function () {
                  total++;
                  if (total == entriesLength) {
                    deferred.resolve(entriesLength);
                  }
                });
              }
            });
          });
        }, function (error) {
          deferred.reject(error);
        });
        return promise;
      },
      /**
       * get file if exists,otherwise download the file
       * @param path(refer to OS file System,see cordova.file.XXXDirectory)
       * @param dir(refer to OS file System sub dir)
       * @param fileName(file name without start with "/")
       * @param downloadUrl(absolute http download url)
       * @return {fileUrl:absolute file url,fileName:unique file name}
       */
      getOrDownloadFileInDir: function (path, dir, fileName, downloadUrl) {
        var me = this;
        var deferred = $q.defer();
        var promise = deferred.promise;
        this.getFilesInDir(dir, path).then(function (entries) {
          var total = 0, fileList = [];
          /*if no files,download file*/
          if (entries.length == 0) {
            me.downloadFile(downloadUrl, dir, false).then(function (result) {
              deferred.resolve({fileUrl: cordova.file.documentsDirectory + dir + "/" + fileName, fileName: fileName});
            }, function (error) {
              deferred.reject(error);
            })
          }
          /*loop dir files*/
          else {
            $.each(entries, function (index, ele) {
              ele.file(function (fileObj) {
                fileList.push({fileUrl: cordova.file.documentsDirectory + dir + "/" + fileName, fileName: fileName});
                /*find file,return file absolute path*/
                if (fileName == fileObj.name) {
                  deferred.resolve({
                    fileUrl: cordova.file.documentsDirectory + dir + "/" + fileName,
                    fileName: fileName
                  });
                  return false;
                }
                /*file not exists,start download*/
                if (fileList.length == entries.length) {
                  me.downloadFile(downloadUrl, dir, false).then(function (result) {
                    deferred.resolve({
                      fileUrl: cordova.file.documentsDirectory + dir + "/" + fileName,
                      fileName: fileName
                    });
                  }, function (error) {
                    deferred.reject(error);
                  })
                }
              });
            });
          }
        }, function (error) {
          deferred.reject(error);
        });
        return promise;
      },

      /**
       * 循环创建目录,
       * @param path
       * @param dir
       * @param fn 回调方法
       */
      createDir:function(path,dir,fn){
        var me = this,left = '';
        if (dir.indexOf("/") == 0) {
          dir = dir.substr(1);
        }
        if (dir.indexOf("/") != -1) {
          left = dir.substring(dir.indexOf("/") + 1);
          dir = dir.substring(0, dir.indexOf("/"));
        }
        $cordovaFile.checkDir(path, dir).then(function () {
          if (left.length > 0) {
            me.createDir(path + dir + "/", left,fn);
          } else {
            if(angular.isFunction(fn)){
              fn.apply(this, arguments);
            }
          }
        }, function () {
          $cordovaFile.createDir(path, dir, false).then(function () {
            if (left.length > 0) {
              me.createDir(path + dir + "/", left,fn);
            } else {
              if(angular.isFunction(fn)){
                fn.apply(this, arguments);
              }
            }
          });
        });
      },
      /**
       * copy file to another directory,if new directory does not exist,create first
       * @param oldPath
       * @param fileList
       * @param newPath
       */
      copyFiles: function (oldPath, fileList, newPath) {
        var deferred = $q.defer(),me=this;
        var promise = deferred.promise;
        $cordovaFile.checkDir(cordova.file.documentsDirectory, newPath)
          .then(function () {
            _.each(fileList || [], function (file) {
              var fileName = file.fileUrl.substring(file.fileUrl.lastIndexOf("/") + 1);
              $cordovaFile.copyFile(oldPath, fileName, cordova.file.documentsDirectory + newPath, fileName);
            });
            deferred.resolve();
          }, function () {
            me.createDir(cordova.file.documentsDirectory, newPath,function () {
              _.each(fileList || [], function (file) {
                var fileName = file.fileUrl.substring(file.fileUrl.lastIndexOf("/") + 1);
                $cordovaFile.copyFile(oldPath, fileName, cordova.file.documentsDirectory + newPath, fileName);
              });
              deferred.resolve();
            });
          });
        return promise;
      }
    }
  });
