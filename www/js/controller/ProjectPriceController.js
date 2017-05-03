/**
 * Created by heyh on 16/2/18.
 */
angular.module('projectPrice.controllers', ['ProjectPrice.services'])
    .controller('ProjectPriceCtrl', function (http, $filter, $cordovaDatePicker, ProjectPriceService, $scope, $state, $stateParams, $ionicLoading, $ionicModal, $ionicViewSwitcher, reqConfig, $log, localStorage, $ionicActionSheet, $cordovaImagePicker, $cordovaCamera, configUtil, $filter, $compile, $document) {

        $scope.goBack = function () {
            $ionicViewSwitcher.nextDirection('back');
            $state.go("projectManage");
        };

        var uid = JSON.parse(localStorage.getUser())["uid"];
        var cid = localStorage.getItem("company") == null ? '' : JSON.parse(localStorage.getItem("company"))["cid"];

        var pageData = $scope.pageData = {
            moreData: true,
            zjsprojects: [],
            pagination: {
                limitSize: 10,
                currentPage: 1
            },
            keyword: '',
            searchData: {
                startTime:'',
                endTime:''
            }
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
                    $scope.pageData.searchData.startTime = $filter('date')(date, "yyyy-MM-dd");
                } else if (dataType == 2) {
                    $scope.pageData.searchData.endTime = $filter('date')(date, "yyyy-MM-dd");
                }
            });
        };

        $scope.searchZjsprojects = function () {
            $scope.getZjsprojects();
        }

        $scope.getZjsprojects = function () {
            ProjectPriceService.getZjsprojects(uid, cid, 1, $scope.pageData.pagination.limitSize, $scope.pageData.keyword, $scope.pageData.searchData)
                .success(function (data) {
                    $scope.pageData.pagination.currentPage = 2;
                    $scope.loadZjsprojectsAfterSuccess(data, true);
                });
        };

        $scope.refreshZjsprojects = function () {
            ProjectPriceService.getZjsprojects(uid, cid, 1, $scope.pageData.pagination.limitSize, $scope.pageData.keyword, $scope.pageData.searchData)
                .success(function (data) {
                    $scope.pageData.pagination.currentPage = 2;
                    $scope.loadZjsprojectsAfterSuccess(data, true);
                    $scope.$broadcast('scroll.refreshComplete');
                })
                .error(function (data) {
                    $scope.$broadcast('scroll.refreshComplete');
                });

        };

        $scope.loadZjsprojectsMore = function () {
            ProjectPriceService.getZjsprojects(uid, cid, $scope.pageData.pagination.currentPage, $scope.pageData.pagination.limitSize, $scope.pageData.keyword, $scope.pageData.searchData)
                .success(function (data) {
                    $scope.pageData.pagination.currentPage += 1;
                    $scope.loadZjsprojectsAfterSuccess(data, false);
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                })
                .error(function (data) {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });

        };

        $scope.loadZjsprojectsAfterSuccess = function (data, refresh) {
            if (data.zjsprojects.length == $scope.pageData.pagination.limitSize) {
                $scope.pageData.moreData = true;
            } else {
                $scope.pageData.moreData = false;
            }
            if (refresh) {
                $scope.pageData.zjsprojects = data.zjsprojects;
            } else {
                $scope.pageData.zjsprojects = $scope.pageData.zjsprojects.concat(data.zjsprojects);
            }
        };

        /**
         * 选择费用类型页面
         */
        $ionicModal.fromTemplateUrl('templates/zjsprojectsModal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.zjsprojectsModal = modal;
        });
        $scope.openZjsprojectsModal = function (_id) {
            ProjectPriceService.getChildZjsprojects(_id).then(function (data) {
                    $scope._childZjsprojects = data.childZjsprojects;
                }
            );
            $scope.zjsprojectsModal.show();
        };
        $scope.closeZjsprojectsModal = function () {
            $scope.zjsprojectsModal.hide();
        };

        /**
         * 费用类型
         * @param costType
         */
        $scope.getChildZjsprojects = function (_childZjsproject) {
            ProjectPriceService.getChildZjsprojects(_childZjsproject.id).then(function (data) {
                    if (data.childZjsprojects.length == 0 && _childZjsproject.filePath != '') {
                        ProjectPriceService.getProjectMdbPath(_childZjsproject.userId, _childZjsproject.filePath).then(function (data) {
                                $ionicViewSwitcher.nextDirection('forward');
                                $state.go('projectAllInfo', {mdbPath: data.mdbPath});
                                $scope.closeZjsprojectsModal();
                            }
                        );
                    } else {
                        $scope._childZjsprojects = data.childZjsprojects;
                    }
                }
            );
        };

    });



