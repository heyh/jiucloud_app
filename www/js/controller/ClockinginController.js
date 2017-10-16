/**
 * Created by heyh on 16/8/2.
 */


angular.module('clockingin.controllers', ['Clockingin.services'])
    .controller('ClockinginCtrl', function ($ionicLoading, reqConfig, localStorage, ClockinginService, $ionicPopup, $log, $scope, $state, $ionicModal, $ionicViewSwitcher, $stateParams) {

        $scope.goBack = function () {
            $ionicViewSwitcher.nextDirection('back');
            $state.go("projectManage", {type: $stateParams.type});
        };

        var uid = JSON.parse(localStorage.getUser())['uid'];
        var cid = JSON.parse(localStorage.getItem('company'))['cid'];

        $scope.pageData = {
            position : {
                longitude: '',
                latitude: '',
                address: ''
            },
            clockinginData: {}
        }

        $scope.$on('$ionicView.afterEnter', function () {

            $ionicLoading.show({template: '地图加载中...'});

            $scope.getCurrentPosition();

        });


        $scope.getCurrentPosition = function () {
            baidumap_location.getCurrentPosition(function (result) {
                var longitude =  $scope.pageData.position.longitude =  result.longitude;
                var latitude = $scope.pageData.position.latitude = result.latitude;
                $scope.pageData.position.address = result.addr;
                showMap(longitude, latitude);
            }, function (error) {
                $log.debug(error);
            });
        }

        function showMap(longitude, latitude) {
            // 百度地图API功能
            var map = new BMap.Map("allmap");
            var point = new BMap.Point(longitude, latitude);
            map.centerAndZoom(point, 12);
            map.enableScrollWheelZoom(true);
            var marker = new BMap.Marker(point);  // 创建标注
            map.addOverlay(marker);               // 将标注添加到地图中
            //把地址在地图上标出来
            var geoc = new BMap.Geocoder();
            geoc.getLocation(point, function (rs) {
                var addrmsg = rs.address;
                var opts = {
                    width: 200,     // 信息窗口宽度
                    height: 50,     // 信息窗口高度
                }
                var infoWindow = new BMap.InfoWindow("地址:" + addrmsg, opts);  //创建信息窗口对象
                map.openInfoWindow(infoWindow, point); //开启信息窗口
                $ionicLoading.hide();
            });
        }

        $scope.clockingin = function ($event, flag) {
            $.extend($scope.pageData.clockinginData, {
                uid: uid,
                cid: cid,
                longitude: $scope.pageData.position.longitude,
                latitude: $scope.pageData.position.latitude,
                address: $scope.pageData.position.address,
                clockinginFlag: flag
            });

            if($scope.pageData.clockinginData.address == undefined || $scope.pageData.clockinginData.address == '') {
                $ionicLoading.show({
                    template: '没有定位到你的具体位置，请退出重试!',
                    duration: 3000
                });
                return false;
            }

            ClockinginService.checkClockingin($scope.pageData.clockinginData).then(function (data) {

                var clockinginTime = data.clockinginTime;
                var clockinginStartTime = data.clockinginTime.clockinginStartTime.substring(11,19);
                var clockinginEndTime = data.clockinginTime.clockinginEndTime.substring(11,19);

                if (data.hasSame == true) {
                    var confirmPopup = $ionicPopup.confirm({
                        title: '提示',
                        template: '已有考勤记录，重新考勤?',
                        cancelText: '取消',
                        okText: '确定'
                    });
                    confirmPopup.then(function(res) {
                        if(res) {
                            checkClockinginTime(clockinginStartTime, clockinginEndTime, flag);
                        } else {
                            return false;
                        }
                    });
                } else {
                    checkClockinginTime(clockinginStartTime, clockinginEndTime, flag);
                }


            });
        };


        function convertDateFromString(dateString) {
            return new Date(dateString.replace(/-/g,"/"))
        }

        function checkClockinginTime(clockinginStartTime, clockinginEndTime, flag) {
            var date = new Date();
            var year = date.getFullYear();
            var month = date.getMonth()+1;
            var day = date.getDate();
            var hour = date.getHours();
            var minute = date.getMinutes();
            var second = date.getSeconds();

            var time = convertDateFromString(year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second );
            if (flag == '0') { // 上班
                var strClockinginStartTime = convertDateFromString(year + '-' + month + '-' + day + ' ' + clockinginStartTime );
                if (strClockinginStartTime < time) { // 迟到
                    $ionicPopup.prompt({
                        title: '事由',
                        cancelText: '取消',
                        okText: '确定'
                    }).then(function(res) {
                        $scope.pageData.clockinginData.reasonDesc = res;
                        $scope.pageData.clockinginData.approvedState = '迟到';

                        ClockinginService.clockingin($scope.pageData.clockinginData);
                    });
                } else {
                    ClockinginService.clockingin($scope.pageData.clockinginData);
                }
            } else if (flag == '1') { // 下班
                var strClockinginEndTime = convertDateFromString(year + '-' + month + '-' + day + ' ' + clockinginEndTime );
                if (strClockinginEndTime > time) { // 早退
                    $ionicPopup.prompt({
                        title: '事由',
                        cancelText: '取消',
                        okText: '确定'
                    }).then(function(res) {
                        $scope.pageData.clockinginData.reasonDesc = res;
                        $scope.pageData.clockinginData.approvedState = '早退';

                        ClockinginService.clockingin($scope.pageData.clockinginData);
                    });
                } else {
                    ClockinginService.clockingin($scope.pageData.clockinginData);
                }
            }
        }
    });



