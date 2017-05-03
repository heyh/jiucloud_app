/**
 * Created by Stomic on 2015/12/5.
 */
angular.module('routeConfig', ['util.localStorage'])
  .config(function($provide){
    //Just a dummy decorator
    $provide.decorator('$log', function($delegate){
      return $delegate;
    });
  })
  .config(function ($stateProvider, $urlRouterProvider, localStorageProvider,$logProvider) {
    /*$http在config方法引无法引用,只能用JQuery读取了,jquery要用同步读取,异步则无效*/
    var configFile = 'js/common/routeConfig.json';
    $.ajaxSetup({
      async:false
    });
    $.get(configFile).success(function (collection) {
        var log = $logProvider.$get();
        var routeJson = angular.isString(collection) ? JSON.parse(collection) : collection;
        for (var routeName in routeJson) {
          var router = routeJson[routeName];
          $stateProvider.state(routeName, router);
          //log.log("routeName[" + routeName + "]:" + JSON.stringify(router));
        }
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise("/login");
        var isTourShow = ((localStorageProvider.getItem("isTourShow") == "true") || false);
        if (isTourShow) {
          $urlRouterProvider.otherwise("/login");
        }
        if(localStorageProvider.getUser()){
          $urlRouterProvider.otherwise("/projectManage");
        }
      })
      .error(function (e) {
        console.log("route config error,please check[" + configFile + "]");
      });
  });
