'use strict';

angular.module('docs').controller('PendingUser',
    function(Restangular, $scope, $state, $dialog) {
        $scope.pendingUsers = [];

        // 获取待审核用户列表
        function loadPendingUsers() {
            Restangular.one('user','pendingUser').get().then(function(users) {
                $scope.pendingUsers = users;
                alert(users)
            }).catch(function(error) {
                console.error('Failed to load users:', error);
            });
        }

        // 审核操作
        $scope.approve = function(username, isApprove) {

            var params = {
                userName: username,
                approve: isApprove
            };

            Restangular.one('user/approve').customPOST(null, '', params, {})
                .then(function(response) {
                    alert('ok');
                })
                .catch(function(error) {
                    console.error('some error', error);
                });

        };

        // 初始化加载
        loadPendingUsers();
    }
);
