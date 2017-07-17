/**
 * Created by heyh on 16/2/18.
 */
angular.module('login.controllers', ['Login.services'])
    .controller('LoginCtrl', function (LoginService, UserDeviceRelService, $scope, $state, $ionicLoading, reqConfig, $ionicModal) {

        $scope.pageData = {
            companyList: [],
            _data: []
        };

        $scope.login = function () {
            if($('.acc').val().trim() == '') {
                $ionicLoading.show({
                    template: '用户名不能为空',
                    duration: reqConfig.loadingDuration
                });
                return false;
            }
            if($('.pass').val().trim() == '') {
                $ionicLoading.show({
                    template: '密码不能为空',
                    duration: reqConfig.loadingDuration
                });
                return false;
            }

            LoginService.login($scope.pageData)
                .success(function (data) {
                    if (data.rspCode == '0000') {
                        $scope.pageData._data = data;
                        localStorage.setItem('user', JSON.stringify({
                            uid: data.user.id,
                            username: data.user.username,
                            realname: data.user.realname,
                            password: data.user.password,
                            mobile_phone: data.user.mobile_phone,
                            email: data.user.email
                        }));

                        localStorage.setItem("isDTSync","0");
                        UserDeviceRelService.addOrUpdate();

                        if (data.companyList.length > 1) {
                            $scope.pageData.companyList = data.companyList;
                            $scope.openCompanyModal();
                        } else {
                            $ionicLoading.show({
                                template: '登录成功',
                                duration: reqConfig.loadingDuration
                            });
                            if (data.companyList.length == 1) {
                                localStorage.setItem('company', JSON.stringify({
                                    cid: data.companyList[0].id,
                                    companyName: data.companyList[0].name
                                }));
                            }

                            localStorage.setItem('right', JSON.stringify({
                                rightList: data.rightList,
                                parentId: data.parentId
                            }));

                            $state.go('projectManage');
                        }


                    }
                });

        }

        $ionicModal.fromTemplateUrl('templates/companyModal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.companyModal = modal;
        });
        $scope.openCompanyModal = function () {
            $scope.companyModal.show();
        };
        $scope.closeCompanyModal = function () {
            $scope.companyModal.hide();
        };

        $scope.chooseCompany = function (company) {
            $ionicLoading.show({
                template: '登录成功',
                duration: reqConfig.loadingDuration
            });

            $scope.pageData.cid = company.id;

            $scope.closeCompanyModal();

            $scope.login();
        };

    });
