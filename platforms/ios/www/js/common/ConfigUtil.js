/**
 * Created by Stomic on 2015/12/10.
 */
angular.module('util.configUtil', ['util.localStorage', 'util.http'])
  .factory('configUtil', function (localStorage, http, $log, $q, $window, reqConfig, $rootScope,ttConvert, ttLoading) {
    $.ajaxSetup({
      async: false
    });
    return {
      getInsuranceConfig : function(){
        return {
            rate: 0.05,
            maxPrice: 50
        };
      },
      getContent: function (url) {
        var content = '';
        $.get(url).success(function (collection) {
          content = angular.isString(collection) ? JSON.parse(collection) : collection;
        })
          .error(function (e) {
            console.log("config read error,please check[" + url + "]");
          });
        return content;
      },
      imgToBase64: function (url, callback, outputFormat) {
        var canvas = document.createElement('CANVAS'),
          ctx = canvas.getContext('2d'),
          img = new Image;
        img.crossOrigin = 'Anonymous';
        img.onload = function () {
          canvas.height = img.height;
          canvas.width = img.width;
          ctx.drawImage(img, 0, 0);
          var dataURL = canvas.toDataURL(outputFormat || 'image/png');
          callback.call(this, dataURL);
          canvas = null;
        };
        img.src = url;
      },
      /**
       * 校验参数编码是否过期
       * 校验没有版本或者版本低于服务器版本,则需要更新相关参数和相关版本信息
       * @param paramCode
       * @param cacheKey  本地缓存使用的关键字
       * @param showLoading 是否显示loading界面
       * @returns {isNeedUpdate:是否需要更新,sysConfig:系统配置版本信息}
       */
      checkSysConfigDataWithParamCode: function (paramCode, cacheKey, showLoading) {
        var deferred = $q.defer();
        var promise = deferred.promise;
          showLoading = showLoading == undefined?true:showLoading;
          if(showLoading){
              $window._showLoading("Loading...");
          }
        http.request("sysConfig/getSysConfigByParamCode", {'paramCode': paramCode}, showLoading)
          .success(function (data) {
            $window._hideLoading();
            deferred.resolve(checkSysConfig(data['data']));
          }).error(function (error) {
            if(showLoading){
                $window._showLoading("Load failed", reqConfig.loadingDuration);
            }
            deferred.reject({isNeedUpdate:false});
          });
        function checkSysConfig(configData) {
          var sysConfigArray = localStorage.getItem("sysConfig"),typeDefineArray = localStorage.getItem(cacheKey);
          var sysConfigData;
          if (sysConfigArray && sysConfigArray != '') {
            sysConfigArray = angular.isString(sysConfigArray) ? JSON.parse(sysConfigArray) : sysConfigArray;
            sysConfigData = _.find(sysConfigArray || [], function (obj) {
              return obj['paramCode'] == paramCode && configData.paramValue ==obj.paramValue;
            });
            if (sysConfigData) {
              if(!typeDefineArray){
                return {
                  isNeedUpdate:true,
                  sysConfig:configData
                }
              }else{
                return {
                  isNeedUpdate:false,
                  sysConfig:configData
                }
              }
            } else {
              return {
                isNeedUpdate:true,
                sysConfig:configData
              }
            }
          }else{
            return {
              isNeedUpdate:true,
              sysConfig:configData
            }
          }
        }
        return promise;
      },
      setSysConfigDataWithParamCode:function(configData){
        var sysConfigArray = localStorage.getItem("sysConfig");
        if (sysConfigArray && sysConfigArray != '') {
          sysConfigArray = angular.isString(sysConfigArray) ? JSON.parse(sysConfigArray) : sysConfigArray;
          var containsSys =  _.find(sysConfigArray || [], function (obj) {
                return obj['paramCode'] == configData.paramCode;
            });
          if(containsSys){
              _.each(sysConfigArray || [], function (obj) {
                  if(obj.paramCode == configData.paramCode){
                      obj.paramValue = configData.paramValue;
                  }
              });
          }else{
              sysConfigArray.push(configData);
          }
        }else{
          sysConfigArray = [];
          sysConfigArray.push(configData);
        }
        localStorage.setItem("sysConfig",JSON.stringify(sysConfigArray));
      },
      getLanId:function(){
        function transferLanId(_key) {
          var _lanId = "1";
          var lanPair = _.chain(localStorage.getItem("languageCacheData") ? JSON.parse(localStorage.getItem("languageCacheData")):[{"name":"zh", "id": "1"},{"name":"en", "id": "2"}])
            .reduce(function(memo,obj){
              memo[obj.name] = obj.id;
              return memo;
            },{}).value();
          $.each(lanPair, function (key, value) {
            var regKey = new RegExp(key);
            if (regKey.test(_key.toLowerCase())) {
              _lanId = value;
              return false;
            }
          });
          $rootScope.lanId = _lanId;
          return _lanId;
        };
        return transferLanId(localStorage.getItem("lang") ||http.getLocale());
      },
      getTypeDefineData: function (showLoading) {
        var deferred = $q.defer(),me=this;
        var promise = deferred.promise;
        me.getLanId();
        showLoading = showLoading == undefined?true:showLoading;
        me.checkSysConfigDataWithParamCode("typeDefineRefresh", "typeDefine", showLoading).then(function(sysConfigCheckData){
          if(sysConfigCheckData.isNeedUpdate){
              if(showLoading){
                  $window._showLoading("Loading...");
              }
            //http.request("param/getParamsByLan",{lanId:transferLanId(http.getLocale())})
            /**
             * without lanId then get all config data
             */
            http.request("param/getParamsByLan", {})
              .success(function (data) {
                localStorage.setItem("typeDefine", JSON.stringify(data['data']));
                $window._hideLoading();
                me.setSysConfigDataWithParamCode(sysConfigCheckData.sysConfig);
                deferred.resolve(data['data']);
              }).error(function (error) {
                if(showLoading){
                    $window._showLoading("Load failed", reqConfig.loadingDuration);
                }
              });
          }else{
            var data = localStorage.getItem("typeDefine");
            if (data && data != '') {
              deferred.resolve(angular.isString(data) ? JSON.parse(data) : data);
            }
          }
        });
        return promise;
      },
        //获取地区的缓存的关键字，由areaCacheData_+lanId(语言id组成)
        getAreaDataCacheKey: function(){
          return "areaCacheData_"+this.getLanId();
        },
        getAreaData: function (showLoading) {
            var deferred = $q.defer(),me=this;
            var lanId = me.getLanId();
            var promise = deferred.promise;
            var areaCacheDataKey = this.getAreaDataCacheKey();
            showLoading = showLoading == undefined?true:showLoading;
            me.checkSysConfigDataWithParamCode("areaRefresh", areaCacheDataKey, showLoading).then(function(sysConfigCheckData){
                if(sysConfigCheckData.isNeedUpdate){
                    if(showLoading){
                        ttLoading.loading("Loading...");
                    }
                    http.request("common.do?method=getALlCountryList", {lanId:lanId}, false)
                        .success(function (data) {
                            if (data.rspCode == '0000' && data.rspMsg.data) {
                                localStorage.setItem(areaCacheDataKey,JSON.stringify(ttConvert.convert(data.rspMsg.data)));
                            }
                            me.setSysConfigDataWithParamCode(sysConfigCheckData.sysConfig);
                            deferred.resolve(data['data']);
                        }).error(function (error) {
                            if(showLoading){
                                ttLoading.showTip("Load failed");
                            }
                        });
                }else{
                    var data = localStorage.getItem(areaCacheDataKey);
                    if (data && data != '') {
                        deferred.resolve(angular.isString(data) ? JSON.parse(data) : data);
                    }
                }
            });
            return promise;
        },
      //传入key为type对应的name，langId为国际化的语言编码
      getTypeDefineWithLanId: function(key, langId){
        var typeDefineData = [];
        var typeDefineArray = JSON.parse(localStorage.getItem("typeDefine"));
        if(typeDefineArray && langId && key){
            var typeDefine;
            for(var i=0; i<typeDefineArray.length; i++){
                typeDefine = typeDefineArray[i];
                if(typeDefine.name == key && typeDefine.lanId == langId){
                    typeDefineData = typeDefine.typeList || [];
                    break;
                }
            }
        }
        return typeDefineData;
      },
      /*获取相机的参数*/
      getCameraOptions: function (options) {
        var cameraOptions = {
          quality: 100,
          destinationType: Camera.DestinationType.FILE_URI,
          sourceType: Camera.PictureSourceType.CAMERA,
          allowEdit: false,
          encodingType: Camera.EncodingType.JPEG,
          targetWidth: $window.innerWidth * ($window.devicePixelRatio || 3),
          targetHeight: $window.innerHeight * ($window.devicePixelRatio || 3),
          popoverOptions: CameraPopoverOptions,
          saveToPhotoAlbum: false,
          correctOrientation: true
        };
        if ($.isPlainObject(options))$.extend(cameraOptions, options);
        return cameraOptions;
      },
      /*获取相机的参数*/
      getAlbumOptions: function (options) {
        var albumOptions = {
          maximumImagesCount: 10,
          width: 800,
          height: 800,
          quality: 80
        };
        if ($.isPlainObject(options))$.extend(albumOptions, options);
        return albumOptions;
      },
      getTotalUnreadMessageCount:function(){
        //获取未读消息数
        var _userInfo = localStorage.getItem("userInfo");
        if(_userInfo){
          _userInfo = JSON.parse(_userInfo);
          if (_userInfo['imToken'] != '') {
            if (window.plugins && window.plugins.rongCloudImPlugIn) {
              window.plugins.rongCloudImPlugIn.getUnreadMessageCount(function (result) {
                $rootScope.totalUnreadMessageCount = ((+(result.totalUnreadCount))<= 0?0:(+(result.totalUnreadCount)));
              }, function (result) {
              }, _userInfo['imToken'], _userInfo);
            }
          }
        };
      },
      getPhoneNumberRegex: function(){
          var reg = /^[\-\+0-9]{5,18}$/;
          return reg;
      },
      getEmailRegex: function(){
          var reg = /^([a-zA-Z0-9_\\-\\.])+@([a-zA-Z0-9_\\-])+(\.[a-zA-Z0-9_\\-]+)+/;
          return reg;
      }
    }
  })
  // ttAlert.alert("NOT_SUPPORT");
  // ttAlert.alert("不翻译提示","My Tip",false);
  .factory('ttAlert', function ($ionicPopup, $translate) {
    return {
      alert: function (content, titleStr, translate) {
        var trans = translate == undefined ? true : translate;
        if (trans) {
          var titleKey = titleStr ? titleStr : 'TITLE_TIP';
          $translate(titleKey).then(function (data) {
            $ionicPopup.alert({
              template: $translate(content),
              title: data
            });
          });

        } else {
          var titleKey = titleStr ? titleStr : "提示";
          $ionicPopup.alert({
            title: titleStr,
            template: content
          });
        }
      }
    }
  })
  .factory("ttConvert", function () {
    return {
      convert: function (json) {
        if (json == null || json == undefined) {
          return undefined;
        }
        var retJson = {};
        if (angular.isString(json) || angular.isNumber(json) || angular.isDate(json)) {
          return json;
        }
        else if ($.isPlainObject(json)) {
          retJson = this.convertPlainObject(json)
        } else if ($.isArray(json)) {
          retJson = this.convertArrayObject(json);
        }
        return retJson;
      },
      convertPlainObject: function (obj) {
        var retObj = obj, me = this;
        if (retObj) {
          var key = "";
          var convertedKey = "";
          $.each(retObj, function (k, v) {
            if (k) {
              if (k != "") {
                convertedKey = me.convertAttr(k);
                retObj[convertedKey] = me.convert(v);
                if (convertedKey != k) {
                  delete retObj[k];
                }
              }
            }
          });
        }
        return retObj;
      },
      convertArrayObject: function (array) {
        var retJson = [], me = this;
        $.each(array, function (n, v) {
          retJson.push(me.convert(v));
        });
        return retJson;
      },
      convertAttr: function (str) {
        return str.replace(/_[a-z]/g,
          function ($1) {
            return $1.substr(1).toLocaleUpperCase();
          });
      }
    }
  })
  .factory("dateUtil", function () {
    return {
      dateFormat: function (date, format) {
        /*
         * format="yyyy-MM-dd hh:mm:ss";
         */
        var o = {
          "M+": date.getMonth() + 1,
          "d+": date.getDate(),
          "h+": date.getHours(),
          "m+": date.getMinutes(),
          "s+": date.getSeconds(),
          "q+": Math.floor((date.getMonth() + 3) / 3),
          "S": date.getMilliseconds()
        };

        if (/(y+)/.test(format)) {
          format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4
            - RegExp.$1.length));
        }

        for (var k in o) {
          if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1
              ? o[k]
              : ("00" + o[k]).substr(("" + o[k]).length));
          }
        }
        return format;
      }
    }
  })
  .factory("pagination", function () {
    var curPage = 1;
    var limitSize = 5;
    var total = 0;
    return {
      initPagination: function (pageSize, totalCount) {
        limitSize = pageSize ? pageSize : limitSize;
        total = totalCount ? totalCount : 0;
        curPage = 1;
      },
      setTotalCount: function (totalNum) {
        total = totalNum;
      },
      getPaginationParam: function () {
        return {currentPage: curPage, limitSize: limitSize};
      },
      getMaxPageSize: function () {
        var maxPageSize = parseInt(total / limitSize) + (total % limitSize == 0 ? 0 : 1);
        return maxPageSize;
      },
      hasNextPage: function () {
        if (curPage >= this.getMaxPageSize()) {
          return false;
        } else {
          return true;
        }
      },
      prePage: function () {
        if (curPage > 1) {
          curPage--;
          return true;
        } else {
          return false;
        }
      },
      nextPage: function () {
        if (curPage < this.getMaxPageSize()) {
          curPage++;
          return true;
        } else {
          return false;
        }
      },
      getPageStartIndex: function () {
        return (curPage - 1) * limitSize + 1;
      },
      getPageEndIndex: function () {
        return curPage * limitSize;
      },
      firstPage: function () {
        curPage = 1;
        return curPage;
      },
      lastPage: function () {
        curPage = this.getMaxPageSize();
      },
      getPageSize: function () {
        return limitSize;
      },
      getTotalCount: function () {
        return total;
      }
    }

  })
// ttLoading.loading("NOT_SUPPORT"); //国际化提示
  // ttLoading.loading("不翻译提示",false);
    //ttLoading.showTip()提示信息，用法同上，时间较短
  .factory('ttLoading', function ($ionicPopup, $ionicLoading, $translate, reqConfig) {
    return {
      loading: function (content, duration, translate) {
          var trans = translate == undefined ? true : translate;
          content = trans ? $translate(content) : content;
          if(duration){
              $ionicLoading.show({
                  template: content,
                  duration: duration
              });
          }else{
              $ionicLoading.show({
                  template: content
              });
          }
      },
      showTip: function (content, translate) {
        this.loading(content, reqConfig.loadingDuration);
      },
      //正在提交...
      submitLoading: function () {
        this.loading('Submitting...');
      },
      submitSuccessLoading: function(){
          this.showTip('Submit successfully');
      },
      //保存成功
      saveSuccessLoading: function () {
        this.showTip('Save success');
      },
      //保存失败
      saveFailedLoading: function () {
        this.showTip('Save Failed');
      },
      //操作成功
      successLoading: function () {
        this.showTip('Success');
      },
      //操作失败，请稍后重试
      failedLoading: function () {
        this.showTip('Failed');
      },
      //上传中...
      uploadLoading: function () {
        this.loading('Uploading...');
      },
      //上传成功
      uploadSuccessLoading: function () {
        this.showTip('Upload success');
      },
      //请求显示 “载入中...”
      requestLoading: function () {
        this.loading('Loading...');
      },
      //隐藏loading框
      hideLoading: function () {
        $ionicLoading.hide();
      }
    }
  })
  .factory("thirdPartUtil", function (configUtil) {
    var supportPlatformArray = configUtil.getContent("js/common/constant.json")['supportedPlatform'];
    return {
      getSupportPlatforms: function () {
        var platforms = [];
        if (supportPlatformArray && supportPlatformArray.length > 0) {
          $.each(supportPlatformArray, function (i, n) {
            platforms.push(n.code);
          });
        }
        return platforms;
      },
      getPlatformCode: function (key) {
        var code;
        if (supportPlatformArray && supportPlatformArray.length > 0) {
          $.each(supportPlatformArray, function (i, n) {
            if (n.platform == key) {
              code = n.code;
              return false;
            }
          });
        }
        return code;
      }

    }
  })
  .factory("aliPay", function (configUtil, localStorage, http, $log, $q, $window, reqConfig, $rootScope,ttConvert, ttLoading) {
    var supportPlatformArray = configUtil.getContent("js/common/constant.json")['supportedPlatform'];
    return {
        pay: function (order) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            if(navigator.alipay){
                navigator.alipay.pay(order
                    ,function(msgCode){
                        var errorTipKey;
                        switch (msgCode){
                            case "9000":
                                errorTipKey = "Payment success";
                                deferred.resolve(msgCode);
                                break;
                            case "8000":
                                errorTipKey = "The order is being processed";
                                deferred.resolve(msgCode);
                                break;
                            case "4000":
                                errorTipKey = "Payment failure";
                                deferred.reject(msgCode);
                                break;
                            case "6001":
                                errorTipKey = "User cancel the payment";
                                deferred.reject(msgCode);
                                break;
                            case "6002":
                                errorTipKey = "Network error";
                                deferred.reject(msgCode);
                                break;
                            default :
                                errorTipKey = "Unknown error";
                                deferred.reject(msgCode);
                                break;
                        }
                        ttLoading.loading(errorTipKey, reqConfig.tipDuration);

                    },function(msg){
                        ttLoading.loading(msg, reqConfig.tipDuration);
                        deferred.reject(msg);
                    });
            }else{
                ttLoading.loading("The device not support alipay", reqConfig.tipDuration);
                deferred.reject();
            }
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
