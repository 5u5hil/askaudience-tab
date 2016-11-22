app.controller('grpCtrl', ['$scope', 'APIFactory', 'Loader', '$rootScope', '$ionicPopup', '$state',
    function ($scope, APIFactory, Loader, $rootScope, $ionicPopup, $state) {
        $scope.groups = {};
        $scope.creatGroupPopup = function () {
            $scope.myPopup = $ionicPopup.alert({
                scope: $scope,
                title: 'Add Group',
                cssClass: 'popup-vertical-buttons',
                buttons: [{
                        text: 'Create New Group',
                        type: 'button-positive',
                        onTap: function (e) {
                            $state.go('app.create-group');
                        }
                    },
                    {
                        text: 'Join Existing Group',
                        type: 'button-balanced',
                        onTap: function (e) {
                        }
                    },
                    {
                        text: 'Cancel',
                        type: 'button-default',
                        onTap: function (e) {
                        }
                    }
                ]
            });
        }

    }
])

        .controller('createGrpCtrl', ['$scope', 'APIFactory', 'Loader', '$rootScope',
            function ($scope, APIFactory, Loader, $rootScope) {
                $scope.acitveTab = 'tab1';
            }
        ])