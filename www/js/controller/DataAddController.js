/**
 * Created by heyh on 16/2/18.
 */
angular.module('dataAdd.controllers', ['DataAdd.services'])
    .controller('DataAddCtrl', function (DataAddService, $scope, $state, $stateParams, $ionicLoading, $ionicModal, $ionicViewSwitcher, reqConfig, $log, localStorage, $ionicActionSheet, $cordovaImagePicker, $cordovaCamera, configUtil, $filter, $compile, $document) {

        $scope.goBack = function () {
            $ionicViewSwitcher.nextDirection('back');
            $state.go("dataCollect", {type: $stateParams.type});
        };

        var uid = JSON.parse(localStorage.getUser())['uid'];
        var cid = JSON.parse(localStorage.getItem('company'))['cid'];
        var companyName = JSON.parse(localStorage.getItem('company'))['companyName'];

        $scope.costInfoTree = [];

        $scope.selLiElem = {};

        $scope.pageData = {
            type: '',
            fieldData: {},
            projectInfos: [],
            unitParams: [],
            imageList: [],
            sectionInfos: [],
            supInfos: [],
            approveUserList: []
        };

        $scope.maxFieldData = '';

        /**
         * 页面初始化参数
         */
        $scope.$on('$ionicView.beforeEnter', function () {

            $scope.pageData.type = $stateParams.type;

            DataAddService.getProjects(cid, uid).then(function (data) {
                $scope.pageData.projectInfos = data.projectInfos;
            });

            DataAddService.getMaxFieldData(cid, uid).then(function (data) {
                if (data.maxFieldData != null) {
                    $scope.pageData.fieldData.projectText = data.proName;
                    $scope.pageData.fieldData.projectName = data.maxFieldData.projectName;

                    $scope.pageData.fieldData.sectionName = data.sectionName;
                    $scope.pageData.fieldData.section = data.maxFieldData.section;

                    getSectionInfos(cid, uid, $scope.pageData.fieldData.projectName);

                    getSupInfo(cid, uid, $scope.pageData.fieldData.projectName, $scope.pageData.fieldData.section);
                }
            });

            DataAddService.getUnitParams().then(function (data) {
                $scope.pageData.unitParams = data.params;
            });

            DataAddService.getCostInfos(uid, cid, $scope.pageData.type).then(function (data) {
                $scope.costInfoTree = $scope.pageData.costInfos = data.costInfos;
            });
        });

        /**
         * 选择费用类型页面
         */
        $ionicModal.fromTemplateUrl('templates/costsTypeModal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.costsTypeModal = modal;
        });
        $scope.openCostsTypeModal = function () {
            $scope.costInfoTree = $scope.pageData.costInfos
            $scope.costsTypeModal.show();
        };
        $scope.closeCostsTypeModal = function () {
            $scope.costsTypeModal.hide();
        };

        /**
         * 费用类型
         * @param costType
         */
        $scope.getCostType = function (costType) {
            if (costType.children == undefined || costType.children.length == 0) {
                $scope.pageData.fieldData.costType = costType.name;
                $scope.pageData.fieldData.nid = costType.id;
                $scope.pageData.fieldData.itemCode = costType.itemCode;

                $scope.closeCostsTypeModal();
            } else {
                $scope.costInfoTree = costType.children;
            }
        };

        /**
         * 选择工程页面
         */
        $ionicModal.fromTemplateUrl('templates/projectModal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.projectModal = modal;
        });
        $scope.openProjectModal = function () {
            $scope.projectModal.show();
        };
        $scope.closeProjectModal = function () {
            $scope.projectModal.hide();
        };

        /**
         * 工程
         * @param projectInfo
         */
        $scope.getProject = function (projectInfo) {
            $scope.pageData.fieldData.projectText = projectInfo.text;
            $scope.pageData.fieldData.projectName = projectInfo.id;
            $scope.closeProjectModal();

            getSectionInfos(cid, uid, $scope.pageData.fieldData.projectName);

            getSupInfo(cid, uid, $scope.pageData.fieldData.projectName, $scope.pageData.fieldData.section);
        };

        function getSectionInfos(cid, uid, projectId) {
            if(projectId == '' || projectId == null) {
                return;
            }
            DataAddService.getSectionInfos(cid, uid, projectId).then(function (data) {
                $scope.sectionInfos = $scope.pageData.sectionInfos = data.itemList;
            });
        }

        /**
         * 选择标段页面
         */
        $ionicModal.fromTemplateUrl('templates/sectionModal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.sectionModal = modal;
        });
        $scope.openSectionModal = function () {
            $scope.sectionModal.show();
        };
        $scope.closeSectionModal = function () {
            $scope.sectionModal.hide();
        };

        /**
         * 标段
         * @param sectionInfo
         */
        $scope.getSection = function (sectionInfo) {
            $scope.pageData.fieldData.sectionName = sectionInfo.text;
            $scope.pageData.fieldData.section = sectionInfo.id;
            $scope.closeSectionModal();

            getSupInfo(cid, uid, $scope.pageData.fieldData.projectName, $scope.pageData.fieldData.section)
        };

        function getSupInfo(cid, uid, projectId, section) {
            if (projectId == '' || section == '') {
                $scope.pageData.supInfos = [];
            }

            DataAddService.getSupInfo(cid, uid, projectId, section).then(function (data) {
                $scope.pageData.supInfos = data.supInfos;
            });
        }

        /**
         * 选择标段附加信息
         */
        $ionicModal.fromTemplateUrl('templates/supInfoModal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.supInfoModal = modal;
        });
        $scope.openSupInfoModal = function () {
            $scope.supInfoModal.show();
        };
        $scope.closeSupInfoModal = function () {
            $scope.supInfoModal.hide();
        };

        /**
         * 附加信息
         * @param unitParam
         */
        $scope.getSupInfo = function (supInfo) {
            $scope.pageData.fieldData.dataName = supInfo;
            $scope.closeSupInfoModal();
        };

        /**
         * 选择单位页面
         */
        $ionicModal.fromTemplateUrl('templates/unitModal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.unitModal = modal;
        });
        $scope.openUnitModal = function () {
            $scope.unitModal.show();
        };
        $scope.closeUnitModal = function () {
            $scope.unitModal.hide();
        };

        /**
         * 单位
         * @param unitParam
         */
        $scope.getUnit = function (unitParam) {
            $scope.pageData.fieldData.unit = unitParam.paramValue;
            $scope.closeUnitModal();
        };

        /**
         * 计算金额
         */
        $scope.cal = function () {
            var count = $scope.pageData.fieldData.count;
            var price = $scope.pageData.fieldData.price;

            var money = '';
            if (count != '' && count != undefined && price != '' && price != undefined) {
                money = parseFloat(count) * parseFloat(price).toFixed(2);
            } else {
                money = 0.00;
            }
            $scope.pageData.fieldData.money = money;
        }

        $scope.myFilter = function (item) {
            return item.parentCode != '';
        }

        $scope.needApproved = function () {
            // debugger;
            var needApproved = $("ion-view[nav-view=active] #needApproved").prop("checked");
            if (needApproved) {
                DataAddService.chooseApprove(cid, uid).then(function (data) {
                    $scope.pageData.approveUserList = data.approveUserList;
                });
                $('#currentApprovedUserDiv').show();
            } else {
                $('#currentApprovedUserDiv').hide();
            }
        }


        /**
         * 提交数据
         * @param $event
         */
        $scope.addData = function ($event) {
            var fieldData = $scope.pageData.fieldData;
            var uid = JSON.parse(localStorage.getUser())["uid"];
            var realName = JSON.parse(localStorage.getUser())["realname"];
            var username = JSON.parse(localStorage.getUser())["username"];
            var uname = realName != null && realName != '' ? realName : username;
            var needApproved = $("ion-view[nav-view=active] #needApproved").prop("checked");
            needApproved = (needApproved ? '1' : '0');
            $.extend(fieldData, {
                uid: uid,
                uname: uname,
                cid: cid,
                companyName: companyName,
                needApproved: needApproved
            });
            debugger
            if(fieldData.projectName == undefined || fieldData.projectName == '') {
                $ionicLoading.show({
                    template: '您工程名称未填写',
                    duration: 3000
                });
                return false;
            }
            if(fieldData.specifications == undefined || fieldData.specifications == '' && $scope.pageData.fieldData.itemCode.substring(0, 3) == '700') {
                $ionicLoading.show({
                    template: '你规格(设施名)未填写',
                    duration: 3000
                });
                return false;
            }
            if(fieldData.nid == undefined || fieldData.nid == '') {
                $ionicLoading.show({
                    template: '您费用类型未填写',
                    duration: 3000
                });
                return false;
            }
            if(fieldData.dataName == undefined || fieldData.dataName == '') {
                $ionicLoading.show({
                    template: '您名称不能未填写',
                    duration: 3000
                });
                return false;
            }
            if(fieldData.unit == undefined || fieldData.unit == '') {
                $ionicLoading.show({
                    template: '您单位未填写',
                    duration: 3000
                });
                return false;
            }
            if(fieldData.count == undefined || fieldData.count == '') {
                $ionicLoading.show({
                    template: '您数量未填写',
                    duration: 3000
                });
                return false;
            }

            DataAddService.addData(fieldData).then(function (data) {
                if($scope.pageData.imageList.length > 0) {
                    DataAddService.uploadFiles($scope.pageData.imageList, {mid: data.mid}).then(function(result) {
                        $ionicLoading.show({
                            template: '附件上传成功',
                            duration: reqConfig.loadingDuration
                        });
                        $ionicViewSwitcher.nextDirection('back');
                        $state.go("dataCollect", {type: $scope.pageData.type});
                    });
                } else {
                    $ionicViewSwitcher.nextDirection('back');
                    $state.go("dataCollect", {type: $scope.pageData.type});
                }
            });
        }

        $scope.$on("$ionicView.afterEnter", function(){
            setTimeout(function(){
                var liTypeElem = $("ion-view[nav-view=active]").find("li");
                $.each(liTypeElem, function (i, el) {
                    $(el).attr("id", new Date().getTime()+parseInt(Math.random() * 100)+"");
                });

                var delElem = liTypeElem.find("span");
                liTypeElem.off("click");
                delElem.off("click");
                liTypeElem.on("click", $scope.showImageUploadChoices);
                delElem.on("click", $scope.delPic);
            }, 200);
        });
        $scope.showDeleteBtn = function ($event) {
            var elem = $event.target;
            var me = $(elem);
            var upperNodeName = $filter('uppercase')(elem.nodeName);
            if(upperNodeName != "LI"){
                me = me.parent("li");
            }
            if(me && me.find("img").length > 0){
                $(me).addClass("del_active");
            }
        };
        $scope.handleClick = function($event){
            var elem = $event.target;
            var jElem = $(elem);
            var upperNodeName = $filter('uppercase')(elem.nodeName);
            var isSpanElem = upperNodeName == "SPAN";
            var isLiElem = upperNodeName == "LI";
            var isImgElem = upperNodeName == "IMG";
            if(isImgElem){
                jElem = jElem.parent("li");
            }
            var showDelElems = $("li.del_active");
            var el;
            if((isSpanElem && jElem.parent().hasClass("del_active")) || ((isLiElem || isImgElem) && jElem.hasClass("del_active"))
            ){
                if(isLiElem){
                    var needHideDelTip = true;
                    $.each(showDelElems, function(i, e){
                        if($(e).attr("id") == jElem.attr("id")){
                            needHideDelTip = false;
                            return false;
                        }
                    });
                    if(needHideDelTip){
                        $scope.hideAllDelTip(showDelElems);
                    }
                }
            }else{
                $scope.hideAllDelTip(showDelElems);
            }
        };
        $scope.hideAllDelTip = function(showDelElems){
            $.each(showDelElems, function(i, e){
                $(e).removeClass("del_active");
            });
        };
        $scope.delPic = function () {
            var _me = $(this).parent("li");
            if(_me && _me.attr("id")){
                $.each($scope.pageData.imageList, function (i, imgObj) {
                    if(imgObj.elemId == _me.attr("id")){
                        $scope.pageData.imageList.splice(i, 1);
                        return false;
                    }
                });
                _me.remove();
            }
        };

        /**
         * 图片选择项
         */
        $scope.showImageUploadChoices = function () {
            $scope.selLiElem = $(this);
            var hideSheet = $ionicActionSheet.show({
                buttons: [{
                    text: '拍照'
                }, {
                    text: '像册'
                }],
                //titleText: $translate.instant("Picture Choose"),
                cancelText: '取消',
                cancel: function () {
                    return true;
                },
                buttonClicked: function (index) {
                    switch (index) {
                        case 0 :
                            $scope.taskPicture();
                            break;
                        case 1 :
                            $scope.readalbum();
                            break;
                        default :
                            break;
                    }
                    return true;
                }
            });
        };

        /**
         * 拍照
         */
        $scope.taskPicture = function () {
            if (!navigator.camera) {
                $log.debug('Environment not support');
                return;
            }

            var options = configUtil.getCameraOptions();
            $cordovaCamera.getPicture(options).then(function (result) {
                $scope.pageData.imageList.push({
                    fileUrl: result,
                    fileName: result.substring(result.lastIndexOf("/") + 1),
                    elemId:$scope.selLiElem.attr("id")
                });
                if ($scope.selLiElem) {
                    $scope.addNewPicAndSelIt(result, false);
                }
            }, function (err) {
                $log.debug('获取照相机数据失败:' + err);
            });
        };

        /**
         * 读用户相册
         */
        $scope.readalbum = function () {
            if (!window.imagePicker) {
                $log.debug('Environment not support');
                return;
            }

            $cordovaImagePicker.getPictures(configUtil.getAlbumOptions()).then(function (results) {
                angular.forEach(results, function (result) {
                    var isSame = false;
                    angular.forEach($scope.pageData.imageList, function (item) {
                        if(angular.equals(item.fileUrl, result)) {
                            isSame = true;
                        }
                    });
                    if (!isSame) {
                        $scope.pageData.imageList.push({
                            fileUrl: result,
                            fileName: result.substring(result.lastIndexOf("/") + 1),
                            elemId:$scope.selLiElem.attr("id")
                        });
                        if ($scope.selLiElem) {
                            $scope.addNewPicAndSelIt(result, true);
                        }
                    }
                });
            }, function (error) {
                $log.debug('获取相册数据失败:' + error);
            });
        };


        $scope.addNewPicAndSelIt = function (photo, sel) {
            var me = $($scope.selLiElem);
            me.off("click");
            var _newPic = me.clone();
            if (photo) {
                var imageEl = $("<img/>");
                imageEl.attr("src", photo);
                me.append(imageEl);
            }

            _newPic.attr("id", new Date().getTime()+"");
            $compile(_newPic)($scope).insertAfter(me);
            _newPic.on("click", $scope.showImageUploadChoices);
            _newPic.find("span").on("click", $scope.delPic);

            if (sel) {
                $scope.selLiElem = _newPic;
            } else {
                $scope.selLiElem = undefined;
            }
        };

        $scope.$on("$ionicView.afterLeave", function() {
            $document.off("click");
        });
        $scope.$on("$ionicView.afterEnter", function(){
            $document.on(
                "click",
                $scope.handleClick
            );
        });
    });



