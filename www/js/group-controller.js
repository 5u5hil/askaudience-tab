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
                                    $scope.createGroup();
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
                $scope.createGroup = function () {
                    $scope.myPopup2 = $ionicPopup.alert({
                        template: '<ion-list><ion-item><input id="my_group_name" type="text" name="group_name" placeholder="Enter Group Name" /></ion-item><ion-item><input type="file" name="group_image" placeholder="Enter Group Name" /></ion-item></ion-list>',
                        scope: $scope,
                        title: 'Create New Group',
                        buttons: [{
                                text: 'Next',
                                type: 'button-positive',
                                onTap: function (e) {
                                    if (jQuery('#my_group_name').val()) {
                                        /////////// save group
                                        ///////// redirect with response ID
                                        $state.go('app.create-group', {id: 01});
                                    } else {
                                        $scope.createGroup();
                                    }
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

            }
        ])