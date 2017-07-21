/**
 * Created by heyh on 16/8/2.
 */


angular.module('approvalDetails.controllers', ['ApprovalDetails.services'])
    .controller('ApprovalDetailsCtrl', function (ApprovalDetailsService, DataDetailsService, DataAddService, $scope, $ionicPopup, localStorage, $state, $ionicModal, $ionicLoading, reqConfig, $ionicViewSwitcher, $stateParams, $ionicActionSheet, fileUtil, $ionicPlatform) {

        $scope.goBack = function () {
            $ionicViewSwitcher.nextDirection('back');
            $state.go("approval");
        };

        var uid = JSON.parse(localStorage.getUser())['uid'];
        var cid = JSON.parse(localStorage.getItem('company'))['cid'];
        $scope.ret = {currentApprovedUser: ''};
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

        $scope.$on('$ionicView.afterEnter', function () {
            DataDetailsService.getFileList($scope.approvalFieldData.id).then(function(data) {
                $scope.fileList = data.fileList;
            });

            DataAddService.chooseApprove(cid, uid).then(function (data) {
                $scope.approveUserList = data.approveUserList;
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
                    return false;
                },
                buttonClicked: function (index) {
                    switch (index) {
                        case 0 :
                            $scope._approvedField($scope.approvalFieldData.id, 2, '');
                            break;
                        case 1 :
                            $scope.chooseCurrentApprovedUser();
                            // $scope._approvedField($scope.approvalFieldData.id, 8, '');
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

        $scope.chooseCurrentApprovedUser = function () {
            var str = "<div class='list'>";
            angular.forEach($scope.approveUserList, function (user) {
               str += "<ion-radio radio-color='balanced' ng-model='ret.currentApprovedUser' ng-value=" + user.id + ">" + user.username+ "</ion-radio>";
            });
            str += "</div>"
            var myPopup = $ionicPopup.show({
                template: str,
                title: '审批人选择',
                scope: $scope,
                buttons: [
                    { text: '取消' },
                    {
                        text: '<b>确认</b>',
                        type: 'button-positive'
                    },
                ]
            });
            myPopup.then(function(res) {
                console.log('Tapped!', $scope.ret.currentApprovedUser);
                $scope._approvedField($scope.approvalFieldData.id, 8, '', $scope.ret.currentApprovedUser);
            });
        }

        $scope._approvedField = function(id, approvedState, approvedOption, currentApprovedUser) {
            ApprovalDetailsService.approvedField(id, approvedState, approvedOption, currentApprovedUser).then(function(data) {
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



