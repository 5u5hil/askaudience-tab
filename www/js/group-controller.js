app.controller('grpCtrl', ['$scope', 'APIFactory', 'Loader', '$rootScope', '$ionicPopup', '$state', 'LSFactory',
    function ($scope, APIFactory, Loader, $rootScope, $ionicPopup, $state, LSFactory) {

        APIFactory.getGroup(LSFactory.get('user').ID).then(function (response) {
            console.log(response.data);
            $scope.getGroupDetails = response.data;
        }, function (error) {
            // $scope.found = [];
        });
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
                            $scope.joinGroup();
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
                template: '<form id="createForm"  enctype="multipart/form-data"><ion-list><ion-item><input id="my_group_name" ng-model="group.groupName" type="text" name="group_name" placeholder="Enter Group Name" /></ion-item><ion-item><input type="file" id="group_image" ng-model="group.groupImg" name="group_image" placeholder="Enter Group Name" /></ion-item></ion-list></form>',
                scope: $scope,
                title: 'Create New Group',
                buttons: [{
                        text: 'Next',
                        type: 'button-positive',
                        onTap: function (e) {

                            if (jQuery('#my_group_name').val()) {
                                Loader.show();
                                var groupImg = jQuery('#group_image').prop('files')[0];
                                var groupName = jQuery('#my_group_name').val();
                                var groupForm = new FormData();
                                groupForm.append('groupImg', groupImg);
                                groupForm.append('groupName', groupName);
                                groupForm.append('userId', LSFactory.get('user').ID);
                                APIFactory.createGroup(groupForm).then(function (response) {
                                    console.log(response);
                                    if (response.data.errorType == 'success') {
                                        Loader.hide();
                                        $state.go('app.create-group', {id: response.data.groupInfo});
                                    } else {
                                        Loader.toggleLoadingWithMessage(response.data.msg, 2000);
                                    }

                                }, function (error) {
                                    // $scope.found = [];
                                });
                                /////////// save group
                                ///////// redirect with response ID
                                //$state.go('app.create-group', {id: 01});
                            } else {
                                $ionicPopup.alert({
                                    template: 'Please Enter Group Name',
                                    title: 'Group Name Required',
                                }).then(function () {
                                    $scope.createGroup();
                                });
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
        $scope.joinGroup = function () {
            $scope.myPopup = $ionicPopup.alert({
                scope: $scope,
                template: '<form id="joinForm"  enctype="multipart/form-data"><ion-list><ion-item><input id="group_id" ng-model="group.groupId" type="text" name="group_id" placeholder="Enter Group Id" /></ion-item></ion-list></form>',
                title: 'Join Group',
                buttons: [
                    {
                        text: 'Join',
                        type: 'button-balanced',
                        onTap: function (e) {
                            if (!jQuery('#group_id').val()) {
                                $ionicPopup.alert({
                                    template: 'Please try again',
                                    title: 'Invalid Group Id',
                                }).then(function () {
                                    $scope.joinGroup();
                                });

                            } else {
                                Loader.show();
                                var groupId = jQuery('#group_id').val();
                                var groupForm = new FormData();
                                groupForm.append('groupId', groupId);
                                groupForm.append('userId', LSFactory.get('user').ID);
                                APIFactory.joinGroup(groupForm).then(function (response) {
                                    if (response.data.errorType == 'success') {
                                        Loader.toggleLoadingWithMessage(response.data.msg, 2000);
                                    } else {
                                        Loader.toggleLoadingWithMessage(response.data.msg, 2000);
                                    }

                                }, function (error) {
                                    // $scope.found = [];
                                });
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
        .controller('createGrpCtrl', ['$scope', 'APIFactory', 'Loader', '$rootScope', '$stateParams',
            function ($scope, APIFactory, Loader, $rootScope, $stateParams) {
                $scope.members = [];
                console.log($stateParams.id);
                APIFactory.getGroupById($stateParams.id).then(function (response) {
                    console.log(response);
                }, function (error) {
                    // $scope.found = [];
                });
                $scope.userSearch = function () {
                    var ionAutocompleteElement = document.getElementsByClassName("get-users");
                    angular.element(ionAutocompleteElement).controller('ionAutocomplete').fetchSearchQuery("", true);
                    angular.element(ionAutocompleteElement).controller('ionAutocomplete').showModal();
                }

                $scope.selectAction = function (user) {
                    $scope.members.push(user.item);
                }

                $scope.removeMember = function (key) {
                    console.log(key);
                }

            }
        ])
        .controller('grpInfoCtrl', ['$scope', 'APIFactory', 'Loader', '$rootScope', '$ionicPopup',
            function ($scope, APIFactory, Loader, $rootScope, $ionicPopup) {
                $scope.activePan = 'members';
                $scope.updatePan = function (tab) {
                    $scope.activePan = tab;
                }

                $scope.editGroup = function (id) {
                    $scope.myPopup2 = $ionicPopup.alert({
                        template: '<form id="createForm"  enctype="multipart/form-data"><ion-list><ion-item><input id="my_group_name" ng-model="group.groupName" type="text" name="group_name" placeholder="Enter Group Name" /></ion-item><ion-item><input type="file" id="group_image" ng-model="group.groupImg" name="group_image" placeholder="Enter Group Name" /></ion-item></ion-list></form>',
                        scope: $scope,
                        title: 'Edit Group',
                        buttons: [{
                                text: 'Next',
                                type: 'button-positive',
                                onTap: function (e) {

                                    if (jQuery('#my_group_name').val()) {
                                        Loader.show();
                                        var groupImg = jQuery('#group_image').prop('files')[0];
                                        var groupName = jQuery('#my_group_name').val();
                                        var groupForm = new FormData();
                                        groupForm.append('groupImg', groupImg);
                                        groupForm.append('groupName', groupName);
                                        groupForm.append('userId', LSFactory.get('user').ID);
                                        APIFactory.createGroup(groupForm).then(function (response) {
                                            if (response.data.errorType == 'success') {
                                                Loader.hide();
                                                $state.go('app.create-group', {id: 01});
                                            } else {
                                                Loader.toggleLoadingWithMessage(response.data.msg, 2000);
                                            }

                                        }, function (error) {
                                            // $scope.found = [];
                                        });
                                        /////////// save group
                                        ///////// redirect with response ID
                                        //$state.go('app.create-group', {id: 01});
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


        .controller('groupPollListingCtrl', ['$ionicNavBarDelegate', '$scope', '$state', '$timeout', 'APIFactory', 'LSFactory', '$rootScope', 'Loader', '$ionicHistory', '$ionicModal', '$ionicPopover', '$ionicScrollDelegate', '$ionicPopup', '$stateParams',
            function ($ionicNavBarDelegate, $scope, $state, $timeout, APIFactory, LSFactory, $rootScope, Loader, $ionicHistory, $ionicModal, $ionicPopover, $ionicScrollDelegate, $ionicPopup, $stateParams) {
                $scope.pageNumber = 1;
                $scope.canLoadMore = false;
                $scope.morePolls = true;
                $scope.myPopup = '';
                console.log($stateParams.cid);
                $scope.showPopup = function () {
                    $scope.data = {};
                    // An elaborate, custom popup
                    $scope.myPopup = $ionicPopup.alert({
                        template: '<ion-list><ion-item ng-click="invokeSort()"><i class="ion-arrow-swap"></i> Sort Latest Polls</ion-item><ion-item ng-click="openFilters()"><i class="ion-funnel"></i> Filter Latest Polls</ion-item></ion-list>',
                        scope: $scope,
                        title: 'Select An Action',
                    });
                };
                $scope.filters = '';
                $scope.orderBy = '';
                $scope.$on('$ionicView.enter', function (e) {
                    $ionicNavBarDelegate.showBar(true);
                });
                $scope.getPollsFilters = function () {
                    Loader.show();
                    APIFactory.getInterests().then(function (response) {
                        $scope.interests = response.data;
                    }, function (error) {

                        Loader.toast('Oops! something went wrong. Please try later again');
                    });
                    APIFactory.getPollType().then(function (response) {
                        $scope.pollTypes = response.data;
                        Loader.hide();
                    }, function (error) {
                        Loader.hide();
                        Loader.toast('Oops! something went wrong. Please try later again');
                    });
                }
                $scope.getPollsFilters();
                $scope.isScroll = 0;
                $scope.getPolls = function (type) {
                    Loader.show();
                    if (type == 'infScr') {
                        $scope.pageNumber = $scope.pageNumber + 1;
                    }
                    if (type == 'pullRef') {
                        $scope.pageNumber = 1;
                        $scope.canLoadMore = true;
                    }
                    if (type == 'onLoad') {

                    }

                    if ($scope.pageNumber == 1 && type != 'pullRef') {
                        Loader.show();
                    }
                    $scope.uid = '';
                    if (LSFactory.get('user')) {
                        $scope.filters.userId = LSFactory.get('user').ID;
                        $scope.uid = parseInt(LSFactory.get('user').ID);
                    } else {
                        $scope.filters.userId = "";
                        $scope.uid = "";
                    }
                    if ($rootScope.isLoggedIn) {
                        $scope.userId = LSFactory.get('user').ID;
                    } else {
                        $scope.userId = null;
                    }
                    var cid = $stateParams.cid;
                    APIFactory.getPollsGroup($scope.filters, $scope.pageNumber, $scope.orderBy, $scope.userId, 'groupPolls', cid).then(function (response) {
                        if ($scope.pageNumber > 1) {
                            if (!response.data.length) {
                                $scope.canLoadMore = false;
                                $scope.morePolls = false;
                            } else {
                                $scope.morePolls = true;
                                angular.forEach(response.data, function (element, index) {
                                    $scope.polls.push(element);
                                });
                            }
                        } else {
                            $scope.polls = "";
                            $scope.polls = response.data;
                            a = $scope.polls;
                            setTimeout(function () {
                                $scope.canLoadMore = true
                            }, 500);
                            //$scope.canLoadMore=true;
                        }
                        Loader.hide();
                    }, function (error) {
                        $scope.canLoadMore = false;
                        Loader.hide();
                        Loader.toast('Oops! something went wrong. Please try later again');
                    }).finally(function () {

                        $scope.$broadcast('scroll.infiniteScrollComplete');
                        $scope.$broadcast('scroll.refreshComplete');
                    });
                }
                $scope.getPolls('onLoad');
                $scope.getFilteredPolls = function () {
                    Loader.show();
                    $scope.pageNumber = 1;
                    $scope.canLoadMore = true;
                    $scope.filters = jQuery("#pollfilter").serialize();
                    $ionicScrollDelegate.scrollTop();
                    $scope.getPolls();
                    $scope.closeFilters();
                }
                $scope.resetForm = function () {
                    jQuery('#pollfilter')[0].reset();
                    $scope.pageNumber = 1;
                    $scope.filters = '';
                    $scope.getPolls();
                }
                $scope.invokeSort = function () {
                    $scope.myPopup.close();
                    $scope.newitem = {}

                    var myPopup = $ionicPopup.show({
                        title: 'Sort By',
                        template: '<form id="ex"> <ion-radio class="wrapping-list" name="borderBy" ng-model="newitem.new"  value="">Latest Polls</ion-radio>' +
                                '<ion-radio class="wrapping-list" name="borderBy" ng-model="newitem.new"  value="total_participants">Most Voted</ion-radio>' +
                                '<ion-radio class="wrapping-list" name="borderBy" ng-model="newitem.new"  value="total_likes">Most Liked</ion-radio>' +
                                '<ion-radio class="wrapping-list" name="borderBy" ng-model="newitem.new"  value="total_reposts">Most Re-posted</ion-radio></form>',
                        scope: $scope,
                        buttons: [
                            {text: 'Cancel'}, {
                                text: '<b>Sort</b>',
                                type: 'button-positive',
                                onTap: function (e) {
                                    $scope.orderBy = jQuery("input[name=borderBy]:checked", "#ex").val();
                                    $scope.getFilteredPolls();
                                }
                            }
                        ]
                    });
                }


                $scope.performTask = function (type, pollid) {
                    if (!$rootScope.isLoggedIn) {
                        $rootScope.$broadcast('showLoginModal', $scope, function () {
                            $ionicHistory.goBack(-1);
                        }, function () {
                            if (type == 'like') {
                                likePoll(pollid);
                            } else if (type == 'notify') {
                                notifyMe(pollid);
                            } else if (type == 'unlike') {
                                UnlikePoll(pollid);
                            } else if (type == 'unNotifyMe') {
                                unNotifyMe(pollid);
                            } else if (type == 'repost') {
                                repost(pollid);
                            } else if (type == 'report') {
                                reportContent(pollid);
                            }
                        });
                    } else {
                        if (type == 'like') {
                            likePoll(pollid);
                        } else if (type == 'notify') {
                            notifyMe(pollid);
                        } else if (type == 'unlike') {
                            UnlikePoll(pollid);
                        } else if (type == 'unNotifyMe') {
                            unNotifyMe(pollid);
                        } else if (type == 'repost') {
                            repost(pollid);
                        } else if (type == 'report') {
                            reportContent(pollid);
                        }
                    }
                };
                function likePoll(pollid) {
                    var data = {pollid: pollid, userId: LSFactory.get('user').ID};
                    Loader.show();
                    APIFactory.likePoll(data).then(function (response) {
                        if (response.data.error) {
                            Loader.toggleLoadingWithMessage(response.data.error, 2000);
                            $scope.popover.hide();
                        } else {
                            Loader.toggleLoadingWithMessage(response.data.success, 2000);
                            $scope.pollLiked = !$scope.pollLiked;
                            $scope.getPolls();
                            $scope.popover.hide();
                        }
                    });
                }

                function repost(pollid) {
                    var data = {pollid: pollid, userId: LSFactory.get('user').ID};
                    Loader.show();
                    APIFactory.repost(data).then(function (response) {
                        if (response.data.error) {
                            Loader.toggleLoadingWithMessage(response.data.error, 2000);
                            $scope.popover.hide();
                        } else {
                            Loader.toggleLoadingWithMessage(response.data.success, 2000);
                            $scope.popover.hide();
                        }
                    });
                }

                function reportContent(pollid) {
                    var data = {pollid: pollid, userId: LSFactory.get('user').ID};
                    Loader.show();
                    APIFactory.flag(data).then(function (response) {
                        if (response.data.error) {
                            Loader.toggleLoadingWithMessage(response.data.error, 2000);
                            $scope.popover.hide();
                        } else {
                            Loader.toggleLoadingWithMessage(response.data.success, 2000);
                            $scope.popover.hide();
                        }
                    });
                }

                function UnlikePoll(pollid) {
                    var data = {pollid: pollid, userId: LSFactory.get('user').ID};
                    Loader.show();
                    APIFactory.unlikePoll(data).then(function (response) {
                        if (response.data.error) {
                            Loader.toggleLoadingWithMessage(response.data.error, 2000);
                            $scope.popover.hide();
                        } else {
                            Loader.toggleLoadingWithMessage(response.data.success, 2000);
                            $scope.popover.hide();
                            $scope.getPolls();
                            $scope.pollLiked = !$scope.pollLiked;
                        }
                    });
                }

                function notifyMe(pollid) {
                    var data = {pollid: pollid, userId: LSFactory.get('user').ID};
                    Loader.show();
                    APIFactory.notifyMe(data).then(function (response) {
                        if (response.data.error) {
                            Loader.toggleLoadingWithMessage(response.data.error, 2000);
                            $scope.popover.hide();
                        } else {
                            Loader.toggleLoadingWithMessage(response.data.success, 2000);
                            $scope.popover.hide();
                            $scope.pollNotify = !$scope.pollNotify;
                        }
                    });
                }

                function unNotifyMe(pollid) {
                    var data = {pollid: pollid, userId: LSFactory.get('user').ID};
                    Loader.show();
                    APIFactory.unNotifyMe(data).then(function (response) {
                        if (response.data.error) {
                            Loader.toggleLoadingWithMessage(response.data.error, 2000);
                            $scope.popover.hide();
                        } else {
                            Loader.toggleLoadingWithMessage(response.data.success, 2000);
                            $scope.popover.hide();
                            $scope.pollNotify = !$scope.pollNotify;
                        }
                    });
                }

                $scope.vote = function (pid, oid, index, getIndex) {
                    if (!$rootScope.isLoggedIn) {
                        $rootScope.$broadcast('showLoginModal', $scope, function () {
                            $ionicHistory.goBack(-1);
                        }, function () {
                            vote(pid, oid, index, getIndex);
                        });
                    } else {
                        vote(pid, oid, index, getIndex);
                    }
                };
                function vote(pid, oid, poll, getIndex) {
                    var index = $scope.polls.indexOf(poll);
                    var data = new FormData(jQuery("form.vote" + pid)[0]);
                    data.append('userId', LSFactory.get('user').ID);
                    Loader.show('Submitting Your Vote ...');
                    APIFactory.vote(data).then(function (response) {
                        if (response.data.error) {
                            Loader.toggleLoadingWithMessage(response.data.error, 2000);
                        } else {
                            Loader.toggleLoadingWithMessage('Voted Successfully', 1000);
                            console.log(response.data);
                            console.log(getIndex);
                            $scope.polls[getIndex].options = response.data;
                            $scope.polls[getIndex].participants.push($scope.uid);
                        }
                    });
                }
                $ionicPopover.fromTemplateUrl('templates/common-template.html', {
                    scope: $scope
                }).then(function (popover) {
                    $scope.popover = popover;
                });
                $ionicPopover.fromTemplateUrl('templates/listing-more.html', {
                    scope: $scope
                }).then(function (popoverMore) {
                    $scope.popoverMore = popoverMore;
                });
                $scope.openListingMore = function () {
                    $scope.popoverMore.show();
                }
                $scope.openPopover = function ($event, poll, index) {
                    var data = {pid: poll.id};
                    APIFactory.pollDetails(data).then(function (response) {
                        $scope.pollForTask = response.data;
                        $scope.popover.show($event);
                        $scope.like_pollid = $scope.pollForTask.id;
                        if (LSFactory.get('user').ID) {
                            if ($scope.pollForTask.likes.indexOf(Number((LSFactory.get('user').ID))) < 0) {
                                $scope.pollLiked = false;
                            } else {
                                $scope.pollLiked = true;
                            }
                            ;
                            if ($scope.pollForTask.notify.indexOf(Number((LSFactory.get('user').ID))) < 0) {
                                $scope.pollNotify = false;
                            } else {
                                $scope.pollNotify = true;
                            }
                            ;
                        }
                    });
                };
                $scope.closeParticipate = function () {
                    $scope.modal.hide();
                };
                $ionicModal.fromTemplateUrl('templates/filters.html', {
                    scope: $scope,
                    animation: 'slide-in-up'
                }).then(function (modal) {
                    $scope.modal = modal;
                });
                $scope.openFilters = function () {
                    $scope.myPopup.close();
                    $scope.modal.show();
                };
                $scope.closeFilters = function () {
                    $scope.modal.hide();
                };
                $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
                    angular.forEach($scope.polls, function (element, index) {
                        jQuery('#' + element.id).countdowntimer({
                            dateAndTime: element.valid_till,
                            size: "lg",
                            regexpMatchFormat: "([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2})",
                            regexpReplaceWith: "$1<span class='displayformat'> days</span>   $2<span class='displayformat'> hrs</span>  $3<span class='displayformat'> mins</span>"
                        })
                    })

                });
            }
        ])
