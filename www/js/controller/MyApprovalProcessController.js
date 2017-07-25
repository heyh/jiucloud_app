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
        var rightList = new Array(JSON.parse(localStorage.getItem("right")).rightList);
        var parentId = JSON.parse(localStorage.getItem("right")).parentId;

        ////////////////////////////////////////////////////////////////////
        var pageData = $scope.pageData = {
            moreData: true,
            myApprovalDataList: [],
            pagination: {
                limitSize: 5,
                currentPage: 1
            },

            hasOnlyReadRight700: JSON.stringify(rightList).indexOf("16")!=-1 && 0 != parentId,
            hasReadEditRight700: JSON.stringify(rightList).indexOf("15")!=-1 || 0 == parentId,
            hasOutRight: JSON.stringify(rightList).indexOf("17")!=-1
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

            angular.forEach(data.myApprovalDataList, function (item) {
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

                if (pageData.hasOutRight && item.itemCode.substring(0, 3) == '800') {
                    item.price = '***';
                } else if(item.itemCode.substring(0, 3) == '700' && !pageData.hasOnlyReadRight700 && !pageData.hasReadEditRight700) {
                    item.price = '***';
                }
                item.money = item.price != '***' ? (item.count * item.price).toFixed(2) : '***';

                item.money_ys = item.price_ys != '' ? (item.count * item.price_ys).toFixed(2) : '0.00';
                item.money_sj = item.price_sj != '' ? (item.count * item.price_sj).toFixed(2) : '0.00';

                if (item.needApproved == '0') {
                    item.approvedStatus = "不需审批";
                } else if (item.needApproved == '1') {
                    item.approvedStatus = "未审批";
                } else if (item.needApproved == '2') {
                    item.approvedStatus = "审批通过";
                } else if (item.needApproved == '8') {
                    item.approvedStatus = "审批中";
                } else if (item.needApproved == '9') {
                    item.approvedStatus = "审批未通过";
                }

            });

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
