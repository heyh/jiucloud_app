/**
 * Created by heyh on 16/8/2.
 */


angular.module('myApprovalDetails.controllers', ['MyApprovalDetails.services'])
    .controller('MyApprovalDetailsCtrl', function (MyApprovalDetailsService, DataDetailsService, localStorage, $scope, $state, $ionicModal, $ionicViewSwitcher, $stateParams, fileUtil, $ionicPlatform, $compile) {

        $scope.goBack = function () {
            $ionicViewSwitcher.nextDirection('back');
            $state.go("myApprovalProcess");
        };

        var uid = JSON.parse(localStorage.getUser())['uid'];

        $(function () {
            $scope._isIOS = $ionicPlatform.is('ios');
            var myApprovalData = $scope.myApprovalData = $stateParams.myApprovalData;
            $scope.myApprovalData.money = (parseFloat($scope.myApprovalData.count) * parseFloat($scope.myApprovalData.price)).toFixed(2);


            if (myApprovalData.approvedOption != '' && myApprovalData.approvedOption != undefined && myApprovalData.approvedOption != 'undefined') {
                var approvedOptions = [];
                var _approvedOptions = myApprovalData.approvedOption.split('|');
                for (var i=0; i<_approvedOptions.length; i++) {
                    var approvedOption = {};
                    var _approvedOptionInfos = _approvedOptions[i].split('::');
                    approvedOption.approvedDate = _approvedOptionInfos[0];
                    approvedOption.approvedUser = _approvedOptionInfos[1];
                    approvedOption.approvedOption =  _approvedOptionInfos[2];
                    approvedOptions = approvedOptions.concat(approvedOption);
                }
                $scope.myApprovalData.approvedOptions = approvedOptions;
            }
        });

        /**
         * 选择单位页面
         */
        $ionicModal.fromTemplateUrl('templates/approvalOptionModal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.approvalOptionModal = modal;
        });
        $scope.openApprovedOptionModal = function () {
            $scope.approvalOptionModal.show();
        };
        $scope.closeApprovedOptionModal = function () {
            $scope.approvalOptionModal.hide();
        };

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

        $scope.canEdit = function (fieldData) {
            var fieldData = $scope.myApprovalData;
            return (($scope.compareDate($scope.getCurrentDate(), fieldData.creatTime.substring(0, 10)) == 0 && uid == fieldData.uid && '0' == fieldData.isLock && '2' != fieldData.needApproved)
            || fieldData.needApproved == '9');
        };

        $scope.goDataEdit = function (fieldData) {
            var itemCode = $scope.myApprovalData.itemCode;
            var prefixItemCode = itemCode.substring(0, 3);
            var type = '';

            if (prefixItemCode == '000' || prefixItemCode > 900) {  // 资料
                type = 'doc';
            } else if (prefixItemCode == '700') {                   // 清单
                type = 'bill';
            } else if (prefixItemCode == '800') {                   // 材料
                type = 'material';
            } else {                                                // 数据
                type = 'data';
            }

            $ionicViewSwitcher.nextDirection('forward');
            if (type == 'data' || type == 'doc') {
                $state.go('dataEdit', {fieldData: $scope.myApprovalData, type: type, page:'myApprovalDetails'});
            } else if (type == 'bill') {
                $state.go('billEdit', {fieldData: $scope.myApprovalData, type: type, page:'myApprovalDetails'});
            } else if (type == 'material') {
                $state.go('materialEdit', {fieldData: $scope.myApprovalData, type: type, page:'myApprovalDetails'});
            }
        }

        // yyyy-MM-dd 日期比较
        $scope.compareDate = function (dateA, dateB) {
            return new Date(dateA.replace(/-/g, "/")) - new Date(dateB.replace(/-/g, "/"));
        }

        // 获取当前日期
        $scope.getCurrentDate = function () {
            var date = new Date();
            var seperator = "-";
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            var currentdate = year + seperator + month + seperator + strDate;
            return currentdate;
        }
    });



