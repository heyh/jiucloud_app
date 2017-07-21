/**
 * Created by Stomic on 15/12/23.
 */
angular.module('util.pushUtil', ['UserDeviceRelService.services'])
    .factory('pushUtil', function ($log, $ionicPlatform, UserDeviceRelService, localStorage,$state, $ionicViewSwitcher) {
        return {
            getRegistrationID: function (data) {

                try {
                    if (data.length == 0) {
                        window.setTimeout(getRegistrationID, 1000);
                    }else {
                        localStorage.setItem("registrationId",data);
                    }

                } catch (exception) {
                    console.log(exception);
                }
            },
            onOpenNotification: function (event) {
                var alertContent;
                if ($ionicPlatform.isAndroid) {
                    alertContent = window.plugins.jPushPlugin.openNotification.alert;
                } else {
                    alertContent = event.aps.alert;
                }
                window.plugins.jPushPlugin.setApplicationIconBadgeNumber(0);
                window.plugins.jPushPlugin.setBadge(0);

                if (localStorage.getUser()) {
                    $ionicViewSwitcher.nextDirection('forward');
                    $state.go('approval');
                }
            },

            onReceiveNotification: function (event) {
                var alertContent, me = this;
                if ($ionicPlatform.isAndroid) {
                    alertContent = window.plugins.jPushPlugin.receiveNotification.alert;
                } else {
                    alertContent = event.aps.alert;
                }
                window.plugins.jPushPlugin.setApplicationIconBadgeNumber(0);
                window.plugins.jPushPlugin.setBadge(0);
            },

            onReceiveMessage: function (event) {
                try {
                    var _data;
                    if ($ionicPlatform.isAndroid) {
                        _data = window.plugins.jPushPlugin.receiveMessage.message;
                    } else {
                        _data = event.content;
                    }
                    _data = angular.isString(_data) ? JSON.parse(_data) : _data;
                    //fireNotification('',_data.message,_data.extra||{});
                    alert("receive Message:" + _data.message + " with extra:" + JSON.stringify(_data.extra || {}));
                }
                catch (exception) {
                    alert("JPushPlugin:onReceiveMessage-->" + exception);
                }
            },

            onBackgroundNotification: function (event) {
                console.log('onBackgroundNotification');
            }
        }
    });
