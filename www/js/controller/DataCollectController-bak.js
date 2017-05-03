/**
 * Created by heyh on 16/2/18.
 */
angular.module('dataCollect.controllers', ['DataCollect.services'])
    .controller('DataCollectCtrl', function (DataCollectService, $scope, $state, $stateParams, $ionicModal, $ionicViewSwitcher, localStorage, $ionicLoading, reqConfig, $ionicPopup) {

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
            type: $stateParams.type,
            moreData: true,
            fieldDataList: [],
            pagination: {
                limitSize: 5,
                currentPage: 1
            },
            keyword: '',
            hasOnlyReadRight700: _contains(rightList, "16") && 0 != parentId,
            hasReadEditRight700: _contains(rightList, "15") || 0 == parentId
        };

        function _contains( arr, value ) {
            if(arr != null && arr.length > 0) {
                for (_value in arr) {
                    if (value == _value) return true;
                }
            }

            return false;
        }

        $scope.searchFieldDatas = function() {
            $scope.getFieldDataList();
        }

        $scope.getFieldDataList = function () {
            DataCollectService.getFieldDataList(uid, cid, $scope.pageData.type, 1, $scope.pageData.pagination.limitSize, $scope.pageData.keyword)
                .success(function (data) {
                    $scope.pageData.pagination.currentPage = 2;
                    $scope.loadFieldDatasAfterSuccess(data, true);
                });
        };

        $scope.refreshFieldDatas = function () {
            DataCollectService.getFieldDataList(uid, cid, $scope.pageData.type, 1, $scope.pageData.pagination.limitSize, $scope.pageData.keyword)
                .success(function (data) {
                    $scope.pageData.pagination.currentPage = 2;
                    $scope.loadFieldDatasAfterSuccess(data, true);
                    $scope.$broadcast('scroll.refreshComplete');
                })
                .error(function (data) {
                    $scope.$broadcast('scroll.refreshComplete');
                });

        };

        $scope.loadFieldDatasMore = function () {
            DataCollectService.getFieldDataList(uid, cid, $scope.pageData.type, $scope.pageData.pagination.currentPage, $scope.pageData.pagination.limitSize, $scope.pageData.keyword)
                .success(function (data) {
                    $scope.pageData.pagination.currentPage += 1;
                    $scope.loadFieldDatasAfterSuccess(data, false);
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                })
                .error(function (data) {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });

        };

        $scope.loadFieldDatasAfterSuccess = function (data, refresh) {
            if (data.fieldDataList.length == $scope.pageData.pagination.limitSize) {
                $scope.pageData.moreData = true;
            } else {
                $scope.pageData.moreData = false;
            }
            if (refresh) {
                $scope.pageData.fieldDataList = data.fieldDataList;
            } else {
                $scope.pageData.fieldDataList = $scope.pageData.fieldDataList.concat(data.fieldDataList);
            }
        };

        /**
         * 查看详情
         * @param fieldData
         */
        $scope.goDataDetails = function (fieldData) {
            $ionicViewSwitcher.nextDirection('forward');
            $state.go('dataDetails', {fieldData: fieldData, type: $scope.pageData.type});
        };

        /**
         * 左划显示编辑、删除
         * @param fieldData
         * @returns {boolean}
         */
        $scope.canEdit = function (fieldData) {
            return (($scope.compareDate($scope.getCurrentDate(), fieldData.creatTime.substring(0, 10)) == 0 && uid == fieldData.uid && '0' == fieldData.isLock && '2' != fieldData.needApproved)
                || (fieldData.itemCode.substring(0, 3) == '700' && pageData.hasReadEditRight700 ));
        };;

        /**
         * 增加fieldData
         */
        $scope.goDataAdd = function () {
            $ionicViewSwitcher.nextDirection('forward');
            $state.go('dataAdd', {type: $scope.pageData.type});
        }

        /**
         * 编辑fieldData
         * @param fieldData
         */
        $scope.goDataEdit = function (fieldData) {
            $ionicViewSwitcher.nextDirection('forward');
            $state.go('dataEdit', {fieldData: fieldData, type: $scope.pageData.type});
        }


        /**
         * 删除fieldData
         * @param fieldData
         */
        $scope.delData = function (fieldData) {
            $ionicPopup.confirm({
                title: '删除',
                template: '确认删除当前数据?',
                cancelText: '取消',
                okText: '确定'
            }).then(function (result) {
                if (result) {
                    DataCollectService.delData(fieldData.id).then(function (data) {
                        $ionicLoading.show({
                            template: data.data,
                            duration: reqConfig.loadingDuration
                        });
                        $scope.refreshFieldDatas();
                    });
                }
            });
        }


        // 获取当前日期
        $scope.getCurrentDate = function () {
            var date = new Date();
            var seperator = "-";
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            var currentdate = year + seperator + month + seperator + strDate;
            return currentdate;
        }

        // yyyy-MM-dd 日期比较
        $scope.compareDate = function (dateA, dateB) {
            return new Date(dateA.replace(/-/g, "/")) - new Date(dateB.replace(/-/g, "/"));
        }
    });



