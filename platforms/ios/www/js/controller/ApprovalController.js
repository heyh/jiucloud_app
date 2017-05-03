/**
 * Created by heyh on 16/2/18.
 */
angular.module('approval.controllers', ['Approval.services'])
    .controller('ApprovalCtrl', function (ApprovalService, $scope, $state, $ionicViewSwitcher, localStorage) {

        $scope.goBack = function () {
            $ionicViewSwitcher.nextDirection('back');
            $state.go("projectManage");
        };

        var uid = JSON.parse(localStorage.getUser())["uid"];
        var cid = JSON.parse(localStorage.getItem("company"))["cid"];

        ////////////////////////////////////////////////////////////////////
        var pageData = $scope.pageData = {
            moreData: true,
            approvalFieldDataList: [],
            pagination: {
                limitSize: 5,
                currentPage: 1
            }
        };

        $scope.getApprovalFieldDataList = function () {
            ApprovalService.getApprovalFieldDataList(uid, cid, 1, $scope.pageData.pagination.limitSize)
                .success(function (data) {
                    $scope.pageData.pagination.currentPage = 2;
                    $scope.loadApprovalFieldDatasAfterSuccess(data, true);
                });
        };

        $scope.refreshApprovalFieldDatas = function () {
            ApprovalService.getApprovalFieldDataList(uid, cid, 1, $scope.pageData.pagination.limitSize)
                .success(function (data) {
                    $scope.pageData.pagination.currentPage = 2;
                    $scope.loadApprovalFieldDatasAfterSuccess(data, true);
                    $scope.$broadcast('scroll.refreshComplete');
                })
                .error(function (data) {
                    $scope.$broadcast('scroll.refreshComplete');
                });

        };

        $scope.loadApprovalFieldDatasMore = function () {
            ApprovalService.getApprovalFieldDataList(uid, cid, $scope.pageData.pagination.currentPage, $scope.pageData.pagination.limitSize)
                .success(function (data) {
                    $scope.pageData.pagination.currentPage += 1;
                    $scope.loadApprovalFieldDatasAfterSuccess(data, false);
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                })
                .error(function (data) {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });

        };

        $scope.loadApprovalFieldDatasAfterSuccess = function (data, refresh) {
            if (data.approvalFieldDataList.length == $scope.pageData.pagination.limitSize) {
                $scope.pageData.moreData = true;
            } else {
                $scope.pageData.moreData = false;
            }
            if (refresh) {
                $scope.pageData.approvalFieldDataList = data.approvalFieldDataList;
            } else {
                $scope.pageData.approvalFieldDataList = $scope.pageData.approvalFieldDataList.concat(data.approvalFieldDataList);
            }
        };

        $scope.goApprovalDetails = function (approvalFieldData) {
            $ionicViewSwitcher.nextDirection('forward');
            $state.go('approvalDetails', {approvalFieldData: approvalFieldData});
        }
    });
