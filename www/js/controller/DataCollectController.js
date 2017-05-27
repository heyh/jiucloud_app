/**
 * Created by heyh on 16/2/18.
 */
angular.module('dataCollect.controllers', ['DataCollect.services'])
    .controller('DataCollectCtrl', function ($ionicLoading, http, $filter, $cordovaDatePicker, DataAddService, $timeout, DataCollectService, $ionicScrollDelegate, $scope, $state, $stateParams, $ionicModal, $ionicViewSwitcher, localStorage, $ionicLoading, reqConfig, $ionicPopup) {

        $scope.goBack = function () {
            $ionicViewSwitcher.nextDirection('back');
            $state.go("projectManage");
        };
        $scope.h=Math.min(document.documentElement.clientHeight,window.innerHeight)-53-43-68.31;
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
                limitSize: 100,
                currentPage: 1
            },
            keyword: '',
            advancedSearchData: {
                projectName: '',
                projectText: '',
                itemCode:'',
                costType:'',
                startTime:'',
                endTime:''
            },
            projectInfos: [],
            costInfos: [],

            hasOnlyReadRight700: JSON.stringify(rightList).indexOf("16")!=-1 && 0 != parentId,
            hasReadEditRight700: JSON.stringify(rightList).indexOf("15")!=-1 || 0 == parentId,
            hasOutRight: JSON.stringify(rightList).indexOf("17")!=-1
        };

        $scope.$on('$ionicView.beforeEnter', function () {

            $scope.pageData.type = $stateParams.type;

            DataAddService.getProjects(cid, uid).then(function (data) {
                $scope.pageData.projectInfos = data.projectInfos;
            });


            DataAddService.getCostInfos(uid, cid, $scope.pageData.type).then(function (data) {
                $scope.costInfoTree = $scope.pageData.costInfos = data.costInfos;
            });

            //$scope.searchFieldDatas();
        });

        /**
         * 查询
         */
        $scope.searchFieldDatas = function() {
            $scope.getFieldDataList();
        }

        $scope.advancedSearchFieldDatas = function() {
            $scope.getFieldDataList();
            $scope.closeAdvancedSearchModal();
        }

        $scope.clearAdvancedSearch = function () {
            $scope.pageData.keyword = '';
            $scope.pageData.advancedSearchData.projectName = '';
            $scope.pageData.advancedSearchData.projectText = '';
            $scope.pageData.advancedSearchData.itemCode = '';
            $scope.pageData.advancedSearchData.costType = '';
            $scope.pageData.advancedSearchData.startTime = '';
            $scope.pageData.advancedSearchData.endTime = '';

            $scope.getFieldDataList();

        }

        /**
         * 高级查询
         */
        $ionicModal.fromTemplateUrl('templates/advancedSearchModal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.advancedSearchModal = modal;
        });
        $scope.openAdvancedSearchModal = function () {
            $scope.advancedSearchModal.show();
        };
        $scope.closeAdvancedSearchModal = function () {
            $scope.advancedSearchModal.hide();
        };

        /**
         * 选择费用类型页面
         */
        $ionicModal.fromTemplateUrl('templates/costsTypeModal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.costsTypeModal = modal;
        });
        $scope.openCostsTypeModal = function () {
            $scope.costInfoTree = $scope.pageData.costInfos
            $scope.costsTypeModal.show();
        };
        $scope.closeCostsTypeModal = function () {
            $scope.costsTypeModal.hide();
        };

        /**
         * 费用类型
         * @param costType
         */
        $scope.getCostType = function (costType) {
            if (costType.children == undefined || costType.children.length == 0) {
                $scope.pageData.advancedSearchData.costType = costType.name;
                $scope.pageData.advancedSearchData.nid = costType.id;
                $scope.pageData.advancedSearchData.itemCode = costType.itemCode;

                $scope.closeCostsTypeModal();
            } else {
                $scope.costInfoTree = costType.children;
            }
        };

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


        $scope.getProject = function (projectInfo) {
            $scope.pageData.advancedSearchData.projectText = projectInfo.text;
            $scope.pageData.advancedSearchData.projectName = projectInfo.id;
            $scope.closeProjectModal();
        };

        $scope.chooseDate = function ($event, dataType) {
            var options = {
                date: new Date(),
                mode: 'date', // or 'time'
                //minDate: new Date(),
                //maxDate: new Date(Date.parse('2050-12-31')),
                maxDate: new Date(),
                allowOldDates: true,
                allowFutureDates: false,
                doneButtonLabel: '确定',
                doneButtonColor: '#000000',
                cancelButtonLabel: '取消',
                cancelButtonColor: '#000000',
                locale: http.getLocale()
            };
            $cordovaDatePicker.show(options).then(function (date) {
                if (dataType == 1) {
                    $scope.pageData.advancedSearchData.startTime = $filter('date')(date, "yyyy-MM-dd");
                } else if (dataType == 2) {
                    $scope.pageData.advancedSearchData.endTime = $filter('date')(date, "yyyy-MM-dd");
                }
            });
        };


        $scope.getFieldDataList = function () {
            DataCollectService.getFieldDataList(JSON.stringify(rightList), uid, cid, $scope.pageData.type, 1, $scope.pageData.pagination.limitSize, $scope.pageData.keyword, $scope.pageData.advancedSearchData)
                .success(function (data) {
                    $scope.pageData.pagination.currentPage = 2;
                    $scope.loadFieldDatasAfterSuccess(data, true);
                });
        };

        $scope.refreshFieldDatas = function () {
            DataCollectService.getFieldDataList(JSON.stringify(rightList), uid, cid, $scope.pageData.type, 1, $scope.pageData.pagination.limitSize, $scope.pageData.keyword, $scope.pageData.advancedSearchData)
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
            DataCollectService.getFieldDataList(JSON.stringify(rightList), uid, cid, $scope.pageData.type, $scope.pageData.pagination.currentPage, $scope.pageData.pagination.limitSize, $scope.pageData.keyword, $scope.pageData.advancedSearchData)
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

            /** 没有权限查看是隐藏 **/
            if (data.fieldDataList.length > 0) {
                angular.forEach(data.fieldDataList, function (item) {
                    if (!pageData.hasOutRight && item.itemCode.substring(0, 3) == '800') {
                        item.price = '***';
                    } else if(item.itemCode.substring(0, 3) == '700' && !pageData.hasOnlyReadRight700 && !pageData.hasReadEditRight700) {
                        item.price = '***';
                    }
                    item.money = item.price != '***' ? (item.count * item.price).toFixed(2) : '***';

                    item.money_ys = item.price_ys != '' ? (item.count * item.price_ys).toFixed(2) : '0.00';
                    item.money_sj = item.price_sj != '' ? (item.count * item.price_sj).toFixed(2) : '0.00';
                });
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
        };

        $scope.canOutStorage = function (fieldData) {
            return pageData.hasOutRight && fieldData.itemCode.substring(0, 3) == '800' && fieldData.count >= 0;
        }

        /**
         * 增加fieldData
         */
        $scope.goDataAdd = function () {
            $ionicViewSwitcher.nextDirection('forward');
            if ($scope.pageData.type == 'data' || $scope.pageData.type == 'doc') {
                $state.go('dataAdd', {type: $scope.pageData.type});
            } else if ($scope.pageData.type == 'bill') {
                $state.go('billAdd', {type: $scope.pageData.type});
            } else if ($scope.pageData.type == 'material') {
                $state.go('materialAdd', {type: $scope.pageData.type});
            }

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

        // 讨论区
        $scope.goDiscuss = function (fieldData) {
            $ionicViewSwitcher.nextDirection('forward');
            $state.go('discuss', {fieldData: fieldData, type: $scope.pageData.type});
        }

        // 出库
        $scope.goOutStorage = function (fieldData) {
            $ionicViewSwitcher.nextDirection('forward');
            $state.go('outStorage', {fieldData: fieldData, type: $scope.pageData.type});
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

        $scope.h = Math.min(document.documentElement.clientHeight,window.innerHeight)-44-50;
        $scope.scrollRightHorizon=function(){
            var rightHandle = $ionicScrollDelegate.$getByHandle("rightContainerHandle");
            var headHandle = $ionicScrollDelegate.$getByHandle("headContainerHandle");
            var leftHandle = $ionicScrollDelegate.$getByHandle("leftContainerHandle");
            headHandle.scrollTo(rightHandle.getScrollPosition().left,0,false);
            leftHandle.scrollTo(0,rightHandle.getScrollPosition().top,false);
        };
        $scope.noScroll=function(){
            var headHandle = $ionicScrollDelegate.$getByHandle("headContainerHandle");
            headHandle.freezeScroll(true);
            var leftHandle = $ionicScrollDelegate.$getByHandle("leftContainerHandle");
            leftHandle.freezeScroll(true);
        };
    });



