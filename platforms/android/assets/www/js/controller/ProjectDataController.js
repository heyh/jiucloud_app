/**
 * Created by heyh on 16/2/18.
 */
angular.module('projectData.controllers', ['ProjectData.services'])
    .controller('ProjectDataCtrl', function (ProjectDataService, $timeout, $scope, $state, $stateParams, $ionicLoading, $ionicModal, $ionicViewSwitcher, reqConfig, $log, localStorage, $ionicActionSheet, $cordovaImagePicker, $cordovaCamera, configUtil, $filter, $compile, $document) {

        $scope.goBack = function () {
            $ionicViewSwitcher.nextDirection('back');
            $state.go("projectPrice");
            //screen.unlockOrientation();
        };

        $(function () {
            //screen.lockOrientation('landscape');
            $scope.mdbPath = $stateParams.mdbPath;
            $log.debug($scope.mdbPath)
        });

    });



