/**
 * Created by heyh on 16/8/2.
 */


angular.module('myApprovalDetails.controllers', ['MyApprovalDetails.services'])
    .controller('MyApprovalDetailsCtrl', function (MyApprovalDetailsService, DataDetailsService, $scope, $state, $ionicModal, $ionicViewSwitcher, $stateParams, fileUtil, $ionicPlatform) {

        $scope.goBack = function () {
            $ionicViewSwitcher.nextDirection('back');
            $state.go("myApprovalProcess");
        };

        $(function () {
            $scope._isIOS = $ionicPlatform.is('ios');
            $scope.myApprovalData = $stateParams.myApprovalData;
            $scope.myApprovalData.money = (parseFloat($scope.myApprovalData.count) * parseFloat($scope.myApprovalData.price)).toFixed(2);
        });

        $scope.isData = function (itemCode) {
            return itemCode.substring(0, 3) != '000' && itemCode.substring(0, 3) <= 900;
        };

        $scope.$on('$ionicView.afterEnter', function () {
            DataDetailsService.getFileList($scope.myApprovalData.id).then(function(data) {
                $scope.fileList = data.fileList;
            });
        });

        // preview file for ios begin
        $scope.preViewFile = function (downPath, event) {
            downLoadFile(downPath, $(event.target).attr("fileName"));
            event.stopPropagation();
        };

        function downLoadFile(downloadUrl, fileName) {
            var _file;
            if (ionic.Platform.isWebView()) {
                DataDetailsService.getLocalDocs().then(function (fileList) {
                    _file = _.find(fileList, function (file) {
                        if (file.fileName == fileName) {
                            return true;
                        }
                    });
                    fileUtil.downloadFile(downloadUrl, '', true, fileName).then(function (result) {
                        $scope.goDocPreview(cordova.file.documentsDirectory + result);
                    });
                });
            }
        };

        $scope.goDocPreview = function (fileUrl) {
            if (window.plugins && window.plugins.quickLookPlugIn) {
                window.plugins.quickLookPlugIn.openFile(fileUrl);
            }
        };
        // end

        $scope.showBigImage = function (imgUrl) {
            $scope.imgUrl = imgUrl;
            $scope.showModal = function (templateUrl) {
                $ionicModal.fromTemplateUrl(templateUrl, {
                    scope: $scope
                }).then(function (modal) {
                    $scope.modal = modal;
                    $scope.modal.show();
                });
            }
            $scope.showModal('templates/modal/tksPicPreviewModal.html');

        }
        $scope.closeModal = function () {
            $scope.modal.hide();
            $scope.modal.remove()
        };
    });



