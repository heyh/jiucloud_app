/**
 * Created by Administrator on 2016/2/22 0022.
 */
angular.module('index.controllers', ['ionic'])
.controller('actionSheetMenu', function ($scope, $state, $ionicActionSheet, $ionicTabsDelegate) {

    $scope.goProjectManagePage = function (index) {
        $state.go('projectManage');
    };
    $scope.goMessagePage = function (index) {
        $state.go('message');
    };
    $scope.goSysSetPage = function (index) {
        $state.go("sysSet");
    };


    })
