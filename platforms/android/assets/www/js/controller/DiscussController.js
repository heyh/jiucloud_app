/**
 * Created by heyh on 16/8/2.
 */


angular.module('discuss.controllers', ['Discuss.services'])
    .controller('DiscussCtrl', function (localStorage, DiscussService, $scope, $state, $ionicModal, $ionicViewSwitcher, $stateParams, fileUtil, $ionicPlatform) {

        $scope.goBack = function () {
            $ionicViewSwitcher.nextDirection('back');
            $state.go("dataCollect", {type: $stateParams.type});
        };

        $scope.pageData = {
            fieldData: $stateParams.fieldData,
            uid: JSON.parse(localStorage.getUser())['uid'],
            discussType: '',
            discussId: '',
            discussList: [],
            content: ''
        };

        $scope.$on('$ionicView.beforeEnter', function () {

            DiscussService.discussShow($scope.pageData.uid, '0', $scope.pageData.fieldData.id).then(function (data) {
                $scope.pageData.discussType = data.discussType;
                $scope.pageData.discussId = data.discussId;
                $scope.pageData.discussList = data.discussList;
            });
        });
        $scope.addDiscuss = function() {
            if( $scope.pageData.content == '') {
                return;
            }
            DiscussService.addDiscuss($scope.pageData.discussType, $scope.pageData.discussId, $scope.pageData.content, $scope.pageData.uid).then(function(data) {
                DiscussService.discussShow($scope.pageData.uid, '0', $scope.pageData.fieldData.id).then(function (data) {
                    $scope.pageData.discussType = data.discussType;
                    $scope.pageData.discussId = data.discussId;
                    $scope.pageData.discussList = data.discussList;
                });
                $scope.pageData.content = '';
            });

        }

    });



