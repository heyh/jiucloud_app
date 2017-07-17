// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var app = angular.module('starter', ['ionic','baseConfig','util.localStorage','util.configUtil','util.fileUtil','util.pushUtil','util.localNotificationUtil','ngCordova',
  ,'index.controllers','login.controllers','projectManage.controllers','approval.controllers','myApprovalProcess.controllers','dataCollect.controllers',
  'dataAdd.controllers','dataEdit.controllers','dataDetails.controllers','approvalDetails.controllers', 'myApprovalDetails.controllers', 'message.controllers', 'sysSet.controllers',
  'projectPrice.controllers', 'projectAllInfo.controllers', 'projectData.controllers','discuss.controllers','outStorage.controllers']);

app.run(function ($ionicPlatform,$rootScope,$templateCache,pushUtil) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
      setTimeout(function () {
        if(ionic.Platform.isWebView()){
          navigator.splashscreen.hide();
        }
      }, 100);
      //$rootScope.$on('$stateChangeSuccess', stateChangeSuccess);
      //function stateChangeSuccess($rootScope) {
      //  $templateCache.removeAll();
      //};
      window.handleOpenURL = function(url){
        if(window.plugins && window.plugins.quickLookPlugIn){
          window.plugins.quickLookPlugIn.shareFile(url);
        }
      }

        /**
         * 极光推送业务开始
         */

        //启动极光推送服务
        window.plugins.jPushPlugin.init();

        //设置显示最新得条数
        window.plugins.jPushPlugin.setLatestNotificationNum(5);

        //调试模式
        if ($ionicPlatform.isAndroid) {

            window.plugins.jPushPlugin.setDebugMode(true);
            window.plugins.jPushPlugin.setStatisticsOpen(true);
        }else {

            window.plugins.jPushPlugin.setDebugModeFromIos();
            window.plugins.jPushPlugin.setApplicationIconBadgeNumber(0);
        }

        //获取RegistrationID
        getRegistrationID();

        //设置别名
        window.plugins.jPushPlugin.setAlias("bbbb");

        if (window.localStorage.getItem("registrationId")){

            jPushInfo(window.localStorage.getItem("key"),window.localStorage.getItem("registrationId"));
            window.plugins.jPushPlugin.setAlias(window.localStorage.getItem("registrationId"));
        }

        if (device.platform == "Android") {

            //ANDROID接收消息
            window.plugins.jPushPlugin.receiveNotificationInAndroidCallback = function (data) {

                //expresstion
            };

            //ANDROID打开消息
            window.plugins.jPushPlugin.openNotificationInAndroidCallback = function(data){

                //expresstion
            };

        }else {

            //IOS接收消息(APP在前台)
            document.addEventListener("jpush.receiveNotification", onReceiveNotification, false);

            //IOS打开消息
            document.addEventListener("jpush.openNotification", onOpenNotification, false);

            //IOS接收消息(APP在后台)
            document.addEventListener("jpush.backgoundNotification", onBackgroundNotification, false);

        }

        /**
         * 极光推送业务结束
         */
    });

    var onReceiveNotification = function(event) {

        //expresstion

    };

    var onBackgroundNotification = function (event) {

        //expresstion
    };

    var onOpenNotification = function(event) {

        //expresstion
    };


    var getRegistrationID = function() {

        window.plugins.jPushPlugin.getRegistrationID(onGetRegistrationID);
    };

    var onGetRegistrationID = function(data) {

        try {

            console.log("JPushPlugin:registrationID is " + data);

            if (data.length == 0) {
                window.setTimeout(getRegistrationID, 1000);
            }else {
                window.localStorage.setItem("registrationId",data);
            }

        } catch (exception) {
            console.log(exception);
        }
    };

    var isReceiveFunc = function (pushId) {

        //expresstion
    };

    var isOpenFunc = function (pushId) {

        //expresstion
    };

    var jPushInfo = function (key,RegistrationID) {

        //expresstion
    };

        //deal keyboard events to fix element height
        ionic.keyboard.enable();
  });

app.directive('hideTabs', function($rootScope) {
  return {
    restrict: 'A',
    link: function(scope, element, attributes) {
      scope.$on('$ionicView.beforeEnter', function() {
        scope.$watch(attributes.hideTabs, function(value){
          $rootScope.hideTabs = 'tabs-item-hide';
        });
      });
      scope.$on('$ionicView.beforeLeave', function() {
        scope.$watch(attributes.hideTabs, function(value){
          $rootScope.hideTabs = 'tabs-item-hide';
        });
        scope.$watch('$destroy',function(){
          $rootScope.hideTabs = false;
        })
      });
    }
  };
});
