/**
 * Created by Stomic on 15/12/23.
 */
angular.module('util.pushUtil', ['UserDeviceRelService.services'])
  .factory('pushUtil', function ($log,$ionicPlatform,UserDeviceRelService,localStorage) {
    return {
      getRegistrationID:function(data){
        if(data && data != ""){
          localStorage.setItem("dt",data);
        }
        UserDeviceRelService.addOrUpdate().then(function(data){
          //TODO
        },function(error){
          //TODO
        });
      },
      onOpenNotification:function(event){
        var alertContent;
        if($ionicPlatform.isAndroid){
          alertContent=window.plugins.jPushPlugin.openNotification.alert;
        }else{
          alertContent   = event.aps.alert;
        }
        window.plugins.jPushPlugin.setApplicationIconBadgeNumber(0);
        window.plugins.jPushPlugin.setBadge(0);
        //function getSysInfos(){
        //  return localStorage.getItem("sysInfo") ? JSON.parse(localStorage.getItem("sysInfo")) :[];s
        //};
        //function addSysInfos(title,content){
        //  var sysInfo = {};
        //  sysInfo.title = title||'';
        //  sysInfo.content = content||'';
        //  sysInfo.currentTimeStamp = new Date().getTime();
        //  var sysInfos = getSysInfos();
        //  sysInfos.push(sysInfo);
        //  localStorage.setItem("sysInfo",JSON.stringify(sysInfos));
        //};
        //
        //addSysInfos(alertContent);
        //alert("open Notificaiton:"+alertContent);
      },
      onReceiveNotification:function(event){
        var alertContent,me=this;
        if($ionicPlatform.isAndroid){
          alertContent=window.plugins.jPushPlugin.receiveNotification.alert;
        }else{
          alertContent   = event.aps.alert;
        }
        window.plugins.jPushPlugin.setApplicationIconBadgeNumber(0);
        window.plugins.jPushPlugin.setBadge(0);
        //function getSysInfos(){
        //  return localStorage.getItem("sysInfo") ? JSON.parse(localStorage.getItem("sysInfo")) :[];
        //};
        //function addSysInfos(title,content){
        //  var sysInfo = {};
        //  sysInfo.title = title||'';
        //  sysInfo.content = content||'';
        //  sysInfo.currentTimeStamp = new Date().getTime();
        //  var sysInfos = getSysInfos();
        //  sysInfos.push(sysInfo);
        //  localStorage.setItem("sysInfo",JSON.stringify(sysInfos));
        //};
        //
        //addSysInfos(alertContent);
        //alert("receive Notificaiton:"+alertContent);
      },
      onReceiveMessage:function(event) {
        //function fireNotification(title,message,data){
        //  if (window.cordova.plugins.notification.local) {
        //    //local test
        //    var now = new Date().getTime();
        //    var noticeNotification = {
        //      id: 999,
        //      title:title,
        //      text: message,
        //      firstAt: new Date(now + 1 * 100),
        //      badge: 1,
        //      data: data||{},
        //      soundName:'aaa.wav'
        //    };
        //    localNotificationUtil.schedule(noticeNotification);
        //    var promise = localNotificationUtil.registerCallBack("click", function (e, notification) {
        //      window.plugins.jPushPlugin.setBadge(0);
        //    });
        //  }
        //}
        try {
          var _data;
          if ($ionicPlatform.isAndroid) {
            _data = window.plugins.jPushPlugin.receiveMessage.message;
          } else {
            _data = event.content;
          }
          _data = angular.isString(_data) ? JSON.parse(_data) : _data;
          //fireNotification('',_data.message,_data.extra||{});
          alert("receive Message:" + _data.message+" with extra:"+JSON.stringify(_data.extra||{}));
        }
        catch (exception) {
          alert("JPushPlugin:onReceiveMessage-->" + exception);
        }
      }
    }
  });
