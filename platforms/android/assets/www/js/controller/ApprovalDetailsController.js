/**
 * Created by heyh on 16/8/2.
 */


angular.module('approvalDetails.controllers', ['ApprovalDetails.services'])
    .controller('ApprovalDetailsCtrl', function (ApprovalDetailsService, DataDetailsService, $scope, $state, $ionicModal, $ionicLoading, reqConfig, $ionicViewSwitcher, $stateParams, $ionicActionSheet, fileUtil, $ionicPlatform) {

        $scope.goBack = function () {
            $ionicViewSwitcher.nextDirection('back');
            $state.go("approval");
        };

        $(function () {
            $scope._isIOS = $ionicPlatform.is('ios');
            $scope.approvalFieldData = $stateParams.approvalFieldData;
            $scope.approvalFieldData.money = (parseFloat($scope.approvalFieldData.count) * parseFloat($scope.approvalFieldData.price)).toFixed(2);

            var approvedStatus = "";
            if ($scope.approvalFieldData.needApproved == '0') {
                approvedStatus = "不需审批";
            } else if ($scope.approvalFieldData.needApproved == '1') {
                approvedStatus = "未审批";
            } else if ($scope.approvalFieldData.needApproved == '2') {
                approvedStatus = "审批通过";
            } else if ($scope.approvalFieldData.needApproved == '8') {
                approvedStatus = "审批中";
            } else if ($scope.approvalFieldData.needApproved == '9') {
                approvedStatus = "审批未通过";
            }
            $scope.approvalFieldData.approvedStatusName = approvedStatus;
        });

        $scope.isData = function (itemCode) {
            return itemCode.substring(0, 3) != '000' && itemCode.substring(0, 3) <= 900;
        };

        $scope.$on('$ionicView.afterEnter', function () {
            DataDetailsService.getFileList($scope.approvalFieldData.id).then(function(data) {
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

        $scope.approvedField = function ($event) {
            var hideSheet = $ionicActionSheet.show({
                buttons: [
                    {
                        text: '结束审批'
                    },
                    {
                        text: '继续审批',
                    },
                    {
                        text: '审批不通过'
                    }
                ],
                cancelText: '取消',
                cancel: function () {
                    return true;
                },
                buttonClicked: function (index) {
                    switch (index) {
                        case 0 :
                            $scope._approvedField($scope.approvalFieldData.id, 2, '');
                            break;
                        case 1 :
                            $scope._approvedField($scope.approvalFieldData.id, 8, '');
                            break;
                        case 2 :
                            $scope._approvedField($scope.approvalFieldData.id, 9, '');
                            break;
                        default :
                            break;
                    }
                    return false;
                }
            });
        };

        $scope._approvedField = function(id, approvedState, approvedOption) {
            ApprovalDetailsService.approvedField(id, approvedState, approvedOption).then(function(data) {
                $ionicLoading.show({
                    template: '审批成功',
                    duration: reqConfig.loadingDuration
                });
                setTimeout(function(){
                    $ionicViewSwitcher.nextDirection('back');
                    $state.go("approval");
                }, 200);
            });
        };

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



