'use strict';

angular.module('docs').controller('RegisterController',
    function(Restangular,$scope, User, $state, $translate, $dialog) {
        // 初始化用户模型
        $scope.user = {
            username: '',
            password: '',
        };
        $scope.error = '';

        // 提交注册
        $scope.submit = function() {
            User.submitRegistration($scope.user)
                .then(function() {
                    // 注册成功提示
                    var title = 'success';
                    var btns = [{ label: 'ok', cssClass: 'btn-primary' }];
                    $dialog.messageBox(title, btns).then(function() {
                        $state.go('login'); // 返回登录页
                    });
                })
                .catch(function(error) {
                    // 处理错误（如用户名重复）
                    $scope.error = $translate.instant('register.error_' + error.data.code);
                });
        };
    }
);