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

            angular.forEach(data.approvalFieldDataList, function (item) {
                var prefixItemCode = item.itemCode.substring(0, 3);

                if (prefixItemCode == '000' || prefixItemCode > 900) {  // 资料
                    item.fieldDataTypeName = '项目资料';
                    item.fieldDataTypeCode = 'doc';
                } else if (prefixItemCode == '700') {                   // 清单
                    item.fieldDataTypeName = '清单项量';
                    item.fieldDataTypeCode = 'bill';
                } else if (prefixItemCode == '800') {                   // 材料
                    item.fieldDataTypeName = '项目材料';
                    item.fieldDataTypeCode = 'material';
                } else{                                                 // 数据
                    item.fieldDataTypeName = '项目数据';
                    item.fieldDataTypeCode = 'data';
                }
            });
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
