/**
 * Created by heyh on 16/8/2.
 */

angular.module('projectManage.controllers', ['ProjectManage.services'])
    .controller('ProjectManageCtrl', function (ProjectManageService, $scope, $state,  $timeout, $ionicSlideBoxDelegate, $ionicViewSwitcher) {

        $scope.goDataCollect = function (type) {
            $ionicViewSwitcher.nextDirection('forward');
            $state.go('dataCollect', {type: type});
        };

        $scope.goApproval = function () {
            $ionicViewSwitcher.nextDirection('forward');
            $state.go('approval');
        };

        $scope.goApprovalProcess = function () {
            $ionicViewSwitcher.nextDirection('forward');
            $state.go('myApprovalProcess');
        }

        $scope.goProjectPrice = function() {
            $ionicViewSwitcher.nextDirection('forward');
            $state.go('projectPrice');
        }

        $scope.goClockingin = function () {
            $ionicViewSwitcher.nextDirection('forward');
            $state.go('clockingin');
        }

        $scope.goMaterialsApproval = function () {
            $ionicViewSwitcher.nextDirection('forward');
            $state.go('materialsApproval');
        }

        //$scope.bannerSlide = 1;
        $scope.ads = [];

        $scope.$on('$ionicView.beforeEnter', function () {
            ProjectManageService.getAd().then(function(data) {
                $scope.ads = data.adList;

                $timeout(function () {
                    $ionicSlideBoxDelegate.$getByHandle('slideimgs').update();
                }, 100);
                $ionicSlideBoxDelegate.$getByHandle('slideimgs').loop(true);
            });
        });

    });
