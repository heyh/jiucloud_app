/**
 * Created by heyh on 16/8/2.
 */

angular.module('myApprovalProcess.controllers', ['MyApprovalProcess.services'])
    .controller('MyApprovalProcessCtrl', function (MyApprovalProcessService, $scope, $state, localStorage,  $ionicViewSwitcher) {

        $scope.goBack = function () {
            $ionicViewSwitcher.nextDirection('back');
            $state.go("projectManage");
        };

        var uid = JSON.parse(localStorage.getUser())["uid"];
        var cid = JSON.parse(localStorage.getItem("company"))["cid"];

        ////////////////////////////////////////////////////////////////////
        var pageData = $scope.pageData = {
            moreData: true,
            myApprovalDataList: [],
            pagination: {
                limitSize: 5,
                currentPage: 1
            }
        };

        $scope.getMyApprovalDataList = function () {
            MyApprovalProcessService.getMyApprovalDataList(uid, cid, 1, $scope.pageData.pagination.limitSize)
                .success(function (data) {
                    $scope.pageData.pagination.currentPage = 2;
                    $scope.loadMyApprovalDatasAfterSuccess(data, true);
                });
        };

        $scope.refreshMyApprovalDatas = function () {
            MyApprovalProcessService.getMyApprovalDataList(uid, cid, 1, $scope.pageData.pagination.limitSize)
                .success(function (data) {
                    $scope.pageData.pagination.currentPage = 2;
                    $scope.loadMyApprovalDatasAfterSuccess(data, true);
                    $scope.$broadcast('scroll.refreshComplete');
                })
                .error(function (data) {
                    $scope.$broadcast('scroll.refreshComplete');
                });

        };

        $scope.loadMyApprovalDatasMore = function () {
            MyApprovalProcessService.getMyApprovalDataList(uid, cid, $scope.pageData.pagination.currentPage, $scope.pageData.pagination.limitSize)
                .success(function (data) {
                    $scope.pageData.pagination.currentPage += 1;
                    $scope.loadMyApprovalDatasAfterSuccess(data, false);
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                })
                .error(function (data) {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });

        };

        $scope.loadMyApprovalDatasAfterSuccess = function (data, refresh) {
            if (data.myApprovalDataList.length == $scope.pageData.pagination.limitSize) {
                $scope.pageData.moreData = true;
            } else {
                $scope.pageData.moreData = false;
            }
            if (refresh) {
                $scope.pageData.myApprovalDataList = data.myApprovalDataList;
            } else {
                $scope.pageData.myApprovalDataList = $scope.pageData.myApprovalDataList.concat(data.myApprovalDataList);
            }
        };

        $scope.goMyApprovalDetails = function (myApprovalData) {
            $ionicViewSwitcher.nextDirection('forward');
            $state.go('myApprovalDetails', {myApprovalData: myApprovalData});
        }
    });
