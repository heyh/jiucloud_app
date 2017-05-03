
angular.module('sysSet.controllers', ['SysSet.services'])
    .controller('SysSetCtrl', function (SysSetService, $scope, $state, $window, $log, $ionicLoading, localStorage, $ionicViewSwitcher, $ionicPopup, fileUtil, reqConfig) {

        $scope.clearCache = function () {
            fileUtil.removeDicFiles('');
            $ionicLoading.show({
                template: '清除成功',
                duration: reqConfig.loadingDuration
            });
        };
        $scope.goAboutUs = function () {
            $ionicViewSwitcher.nextDirection("forward");
            $state.go("sysSetAboutUs");
        };
        $scope.logout = function () {
            $ionicPopup.confirm({
                title: '退出',
                template: '确认退出当前登录?',
                cancelText: '取消',
                okText: '确定'
            }).then(function (result) {
                if (result) {
                    localStorage.clear();
                    $ionicViewSwitcher.nextDirection("back");
                    $state.go("login");
                }
            })
        };

    });
