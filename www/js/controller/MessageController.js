
angular.module('message.controllers', ['Message.services'])
    .controller('MessageCtrl', function (MessageService, $scope, $state, $log, localStorage, $ionicViewSwitcher) {

        $scope.pageData = {
            uid: JSON.parse(localStorage.getUser())['uid'],
            needApproveList: []
        };

        $scope.$on('$ionicView.beforeEnter', function () {
            MessageService.getNeedApproveList($scope.pageData.uid).then(function (data) {
                $scope.pageData.needApproveList = data.needApproveList;
            });
        });

        $scope.goApproval = function () {
            $ionicViewSwitcher.nextDirection('forward');
            $state.go("approval");
        };

    });
