/**
 * Created by heyh on 16/2/18.
 */
angular.module('outStorage.controllers', ['OutStorage.services'])
    .controller('OutStorageCtrl', function (OutStorageService, DataEditService, $scope, $state, $stateParams, $ionicLoading, $ionicModal, $ionicViewSwitcher, reqConfig, $log, localStorage) {

        $scope.goBack = function () {
            $ionicViewSwitcher.nextDirection('back');
            $state.go("dataCollect", {type: $stateParams.type});
        };

        var uid = JSON.parse(localStorage.getUser())['uid'];
        var cid = JSON.parse(localStorage.getItem('company'))['cid'];

        $scope.pageData = {
            fieldData: $stateParams.fieldData,
            storageCount: 0,
            projectInfos: []
        }

        $scope.$on('$ionicView.beforeEnter', function () {

            DataEditService.getProjects(cid, uid).then(function (data) {
                $scope.pageData.projectInfos = data.projectInfos;
            });

            OutStorageService.getStorageCount($scope.pageData.fieldData.id).then(function (data) {
                $scope.pageData.storageCount = data.storageCount;
            });
        });

        $scope.$on("$ionicView.afterEnter", function () {
            $scope.pageData.fieldData.projectText = $scope.pageData.fieldData.projectName;
            $scope.pageData.fieldData.outProId = $scope.pageData.fieldData.project_id;
        });

        /**
         * 选择工程页面
         */
        $ionicModal.fromTemplateUrl('templates/projectModal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.projectModal = modal;
        });
        $scope.openProjectModal = function () {
            $scope.projectModal.show();
        };
        $scope.closeProjectModal = function () {
            $scope.projectModal.hide();
        };

        /**
         * 工程
         * @param projectInfo
         */
        $scope.getProject = function (projectInfo) {
            $scope.pageData.fieldData.projectText = projectInfo.text;
            $scope.pageData.fieldData.outProId = projectInfo.id;
            $scope.closeProjectModal();
        };

        $scope.outStorage = function ($event) {
            var fieldData = $scope.pageData.fieldData;

            if(fieldData.outCount == undefined || fieldData.outCount == 'undefined' || fieldData.outCount ==  '') {
                $ionicLoading.show({
                    template: '请输入出库数量',
                    duration: reqConfig.loadingDuration
                });
                return;
            }
            if(fieldData.outCount >  $scope.pageData.storageCount) {
                $ionicLoading.show({
                    template: '库存不足,请修改出库数量!',
                    duration: reqConfig.loadingDuration
                });
                return;
            }

            OutStorageService.outStorage(uid, fieldData).then(function(data) {
                $ionicViewSwitcher.nextDirection('back');
                $state.go("dataCollect", {type: $stateParams.type});
            });
        }
    });



