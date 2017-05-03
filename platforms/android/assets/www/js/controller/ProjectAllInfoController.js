/**
 * Created by heyh on 16/2/18.
 */
angular.module('projectAllInfo.controllers', ['ProjectAllInfo.services'])
    .controller('ProjectAllInfoCtrl', function (ProjectAllInfoService, $timeout, $scope, $state, $stateParams, $ionicLoading, $ionicModal, $ionicViewSwitcher, reqConfig, $log, localStorage, $ionicActionSheet, $cordovaImagePicker, $cordovaCamera, configUtil, $filter, $compile, $document) {

        $scope.goBack = function () {
            $scope.changeOriantationPortrait();
            $ionicViewSwitcher.nextDirection('back');
            $state.go("projectPrice");
        };

        document.addEventListener("deviceready", onDeviceReady, false);
        function onDeviceReady() {
            $scope.changeOriantationLandspace = function () {
                screen.lockOrientation('landscape');
            }

            $scope.changeOriantationPortrait = function () {
                screen.lockOrientation('portrait');
            }
        }

        $scope.$on('$ionicView.afterEnter', function () {

            // 横屏
            $scope.changeOriantationLandspace();

            // 工程mdb路径
            $scope.mdbPath = $stateParams.mdbPath;

            // 工程信息
            ProjectAllInfoService.getProjectInfo($scope.mdbPath).then(function (data) {
                $scope.projectInfos = data.projectInfos;
            });

            // 分部分项
            ProjectAllInfoService.getProjectDataInfo($scope.mdbPath).then(function (data) {
                $scope.projectDatas = data.projectDatas;
            });

            // 措施项目
            ProjectAllInfoService.getCSInfo($scope.mdbPath).then(function (data) {
                $scope.csInfos = data.csInfos;
            });

            //措施项目CS1BL
            ProjectAllInfoService.getCS1BLInfo($scope.mdbPath).then(function(data) {
                $scope.cs1blInfos = data.cs1blInfos;
            });

            // 其它项目
            ProjectAllInfoService.getQTInfo($scope.mdbPath).then(function (data) {
                $scope.qtInfos = data.qtInfos;
            });

            // 调市场价
            ProjectAllInfoService.getGLJFJB($scope.mdbPath).then(function(data) {
                $scope.gljfjbInfos = data.gljfjbInfos;
            })

            // 取费
            ProjectAllInfoService.getSummaryInfo($scope.mdbPath).then(function (data) {
                $scope.summaryInfos = data.summaryInfos;
            });

            // 取费SUMMARYBL
            ProjectAllInfoService.getSummaryBLInfo($scope.mdbPath).then(function (data) {
                $scope.summaryBLInfos = data.summaryBLInfos;
            });

        });

        /**
         * 工料换算
         * @param pointNo
         */
        $scope.getProjectMachineInfo = function (projectData) {

            ProjectAllInfoService.getProjectMachineInfo($scope.mdbPath, projectData.pointNo).then(function (data) {
                $scope.projectMachineInfos = data.projectMachineInfos;
            });

            $scope.gcnr = projectData.gcnr;
            $scope.jsgz = projectData.jsgz;
            $scope.mshxmtz = projectData.mshxmtz;

            $scope.listGclgs = [];
            var strGclgs = projectData.gclgs;
            if (strGclgs != null && strGclgs != '') {
                var arrGclgs = strGclgs.split('\n');
                angular.forEach(arrGclgs, function(gclgs) {
                    $scope.listGclgs.concat(gclgs.split('?'));
                });
            }

        };

        /**
         * 其它项目 详情
         * @param qtInfo
         */
        $scope.getQTDetailInfo = function(qtInfo) {
            ProjectAllInfoService.getQTDetailInfo($scope.mdbPath, qtInfo.pointNo, qtInfo.jsgs).then(function(data) {
                $scope.zljemxbInfos = data.zljemxbInfos;
                $scope.zygczgjInfos = data.zygczgjInfos;
                $scope.jrgInfos = data.jrgInfos;
                $scope.zcbfwfInfos = data.zcbfwfInfos;
            })
        }

        /**
         * 控制 分部分项 -> 辅助功能
         * @param $event
         */
        $scope.showAssistant = function ($event) {
            var $a = $('#buttonBar a');
            var $span = $('#content span');

            var $this = $($event.target);
            var $t = $this.index();
            $a.removeClass('activated button-calm');
            $this.addClass('activated button-calm');
            $span.css('display', 'none');
            $span.eq($t).css('display', 'block');

            if ($scope.QFGSInfos == undefined) {
                ProjectAllInfoService.getQFGSInfo($scope.mdbPath).then(function (data) {
                    $scope.QFGSInfos = data.QFGSInfos;
                });
            }

            if($scope.ratetableInfos == undefined) {
                ProjectAllInfoService.getRatetableInfo($scope.mdbPath).then(function(data){
                    $scope.ratetableInfos = data.ratetableInfos;
                    $scope.lbs = data.lbs;
                    $scope.xCount = data.xCount;
                })
            }
        };
    });



