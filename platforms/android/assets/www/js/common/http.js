angular.module('util.http', ['httpConfig'])
  .factory('http', function ($q, $http, reqConfig, $log,$window, ttLoading) {
    var host = reqConfig.host;
    return {
      request: function (url, param, showError) {
        showError = showError == undefined ? true : showError;
        var deferred = $q.defer();
        var promise = deferred.promise;
        url = (url.substr(0, 1) == ("/")) ? url : ("/" + url);
        $http({
          method: 'POST',
          url: host + url,
          data: $.param(param),
          timeout: reqConfig.ajaxTimeout,
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
          .success(function (data,statusCode) {
            $log.debug("statusCode:"+statusCode);
            $log.debug("reqUrl:[" + host + url + "] with param:" + $.param(param));
            $log.debug("rsp:[" + host + url + "] with result:" + JSON.stringify(data));
            deferred.resolve(data);
          })
          .error(function (data,statusCode) {
            $log.debug("statusCode:"+statusCode);
            $log.debug("reqUrl:[" + host + url + "] with param:" + $.param(param));
            $log.debug("rsp:[" + host + url + "] with result:" + JSON.stringify(data));
            if(showError){
                ttLoading.showTip('Network error');
            }
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
      getLocale:function(){
        var nav = $window.navigator,
          browserLanguagePropertyKeys = ['language', 'browserLanguage', 'systemLanguage', 'userLanguage'],
          i,
          language;

        // support for HTML 5.1 "navigator.languages"
        if (angular.isArray(nav.languages)) {
          for (i = 0; i < nav.languages.length; i++) {
            language = nav.languages[i];
            if (language && language.length) {
              return language;
            }
          }
        }

        // support for other well known properties in browsers
        for (i = 0; i < browserLanguagePropertyKeys.length; i++) {
          language = nav[browserLanguagePropertyKeys[i]];
          if (language && language.length) {
            return language;
          }
        }

        return null;
      },
      getData:function(dataArray,key){
        if(!dataArray || dataArray.length ==0)return {};
        if(!key || key == "")return {};
        var reqData = {};
        $.each(dataArray,function(index,ele){
          reqData[$(ele).attr(key)] = $(ele).val()||$(ele).text();
        });
        return reqData;
      }
    }
  });
