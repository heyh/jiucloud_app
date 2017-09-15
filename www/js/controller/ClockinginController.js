/**
 * Created by heyh on 16/8/2.
 */


angular.module('clockingin.controllers', ['Clockingin.services'])
    .controller('ClockinginCtrl', function ($ionicLoading, localStorage, ClockinginService, $log, $scope, $state, $ionicModal, $ionicViewSwitcher, $stateParams) {

        $scope.goBack = function () {
            $ionicViewSwitcher.nextDirection('back');
            $state.go("projectManage", {type: $stateParams.type});
        };

        $scope.$on('$ionicView.afterEnter', function () {
            $ionicLoading.show({
                template: '地图加载中...',
                duration: reqConfig.loadingDuration
            });
            $scope.getCurrentPosition();
        });


        $scope.getCurrentPosition = function () {
            baidumap_location.getCurrentPosition(function (result) {
                var longitude = result.longitude;
                var latitude = result.latitude;
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
            });
        }
    });



