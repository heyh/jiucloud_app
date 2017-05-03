/**
 * Created by heyh on 16/8/2.
 */


angular.module('dataDetails.controllers', ['DataDetails.services'])
    .controller('DataDetailsCtrl', function (DataDetailsService, $scope, $state, $ionicModal, $ionicViewSwitcher, $stateParams, fileUtil, $ionicPlatform) {

        $scope.goBack = function () {
            $ionicViewSwitcher.nextDirection('back');
            $state.go("dataCollect", {type: $stateParams.type});
        };

        var rightList = new Array(JSON.parse(localStorage.getItem("right")).rightList);
        var parentId = JSON.parse(localStorage.getItem("right")).parentId;

        $scope.pageData = {
            type: '',
            hasOnlyReadRight700: JSON.stringify(rightList).indexOf("16")!=-1 && 0 != parentId,
            hasReadEditRight700: JSON.stringify(rightList).indexOf("15")!=-1 || 0 == parentId
        }

        $(function () {
            $scope._isIOS = $ionicPlatform.is('ios');
            $scope.pageData.type = $stateParams.type;
            $scope.fieldData = $stateParams.fieldData;
            $scope.fieldData.money = (parseFloat($scope.fieldData.count) * parseFloat($scope.fieldData.price)).toFixed(2);

            var approvedStatusName = "";
            if ($scope.fieldData.needApproved == '0') {
                approvedStatusName = "不需审批";
            } else if ($scope.fieldData.needApproved == '1') {
                approvedStatusName = "未审批";
            } else if ($scope.fieldData.needApproved == '2') {
                approvedStatusName = "审批通过";
            } else if ($scope.fieldData.needApproved == '8') {
                approvedStatusName = "审批中";
            } else if ($scope.fieldData.needApproved == '9') {
                approvedStatusName = "审批未通过";
            }
            $scope.fieldData.approvedStatusName = approvedStatusName;
        });

        $scope.$on('$ionicView.afterEnter', function () {
            DataDetailsService.getFileList($scope.fieldData.id).then(function(data) {
                $scope.fileList = data.fileList;
            });
        });

        $scope.needApproval = function (needApproved) {
            return needApproved == 0 ? false : true;
        };

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



