/**
 * Created by tamir on 15/12/30.
 */
angular.module('util.localNotificationUtil', [])
    .factory('localNotificationUtil', function ($log,$q,$ionicPlatform,$rootScope,$cordovaLocalNotification) {
        var callBackFnArray = {};
        return {
            //support eventName: click/trigger/cancel
            registerCallBack: function(eventName, fn, scope){
                scope = scope || $rootScope;
                var deferred = $q.defer();
                var promise = deferred.promise;
                var triggerName = '$cordovaLocalNotification:';
                var listener;
                if(eventName && (eventName == 'click' || eventName == 'trigger'
                    || eventName == 'cancel')){
                    triggerName = triggerName + eventName;
                }else{
                    deferred.resolve();
                    return;
                }

                if(typeof fn == 'function'){
                    listener = scope.$on(triggerName, function(e, notification){
                        deferred.resolve(notification);
                        fn.apply(scope, arguments);
                    });
                }else{
                    listener = scope.$on(triggerName, function(e,notification) {
                        deferred.resolve(notification);
                    });
                }

                if(!callBackFnArray[eventName]){
                    callBackFnArray[eventName] = [];
                }
                var hasEventInScope = false;
                $.each(callBackFnArray[eventName], function(i, item){
                    if(item.scope = scope){
                        hasEventInScope = true;
                        item.listener = undefined;
                        item.listener = listener;
                        item.scope = scope;
                        return false;
                    }
                });
                if(!hasEventInScope){
                    var item = {
                        listener: listener,
                        scope: scope
                    };
                    callBackFnArray[eventName].push(item);
                }
                return promise;
            },
            unRegisterCallBack: function(eventName, scope){
                scope = scope || $rootScope;
                $.each(callBackFnArray[eventName], function(i, item){
                    if(item.scope = scope){
                        item.listener = undefined;
                        callBackFnArray[eventName].splice(i);
                        return false;
                    }
                });
            },
            schedule: function(options, scope){
                scope = scope || $rootScope;
                return $cordovaLocalNotification.schedule(options, scope);
            },
            update: function(options, scope){
                scope = scope || $rootScope;
                return $cordovaLocalNotification.update(options, scope);
            },
            cancel: function(ids, scope){
                scope = scope || $rootScope;
                return $cordovaLocalNotification.cancel(ids, scope);
            },
            cancelAll: function(scope){
                scope = scope || $rootScope;
                return $cordovaLocalNotification.cancelAll(scope);
            },
            getAllIds: function(scope){
                scope = scope || $rootScope;
                return $cordovaLocalNotification.getAllIds(scope);
            },
            getScheduledIds: function(ids, scope){
                scope = scope || $rootScope;
                return $cordovaLocalNotification.getScheduledIds(ids, scope);
            },
            isTriggered: function(id, scope){
                scope = scope || $rootScope;
                return $cordovaLocalNotification.isTriggered(id, scope);
            },
            isScheduled: function(id, scope){
                scope = scope || $rootScope;
                return $cordovaLocalNotification.isScheduled(id, scope);
            },
            clear: function(ids, scope){
                scope = scope || $rootScope;
                return $cordovaLocalNotification.clear(ids, scope);
            },
            clearAll: function(scope){
                scope = scope || $rootScope;
                return $cordovaLocalNotification.clearAll(scope);
            }
        }
    });