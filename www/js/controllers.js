var a;
var ptype;
angular.module('askaudience.controllers', [])
        .controller('AppCtrl', ['$scope', '$ionicModal', '$timeout', '$ionicPopover', 'APIFactory', 'Loader', '$rootScope', 'LSFactory', '$ionicActionSheet',
            '$cordovaOauth', '$ionicPopup', '$state', '$ionicHistory', '$http', 'CommonFactory', '$cordovaSocialSharing',
            function ($scope, $ionicModal, $timeout, $ionicPopover, APIFactory, Loader, $rootScope, LSFactory, $ionicActionSheet, $cordovaOauth, $ionicPopup,
                    $state, $ionicHistory, $http, CommonFactory, $cordovaSocialSharing) {

                $rootScope.colors = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b"];

                $rootScope.socialShare = function (message, subject, file) {
                    var link = domain + "socialshare";
                    $cordovaSocialSharing.share(message, subject, file, link) // Share via native share sheet
                            .then(function (result) {

                            }, function (err) {


                            });
                }
                $scope.clickButton = function () {
                    var ionAutocompleteElement = document.getElementsByClassName("ion-autocomplete");
                    angular.element(ionAutocompleteElement).controller('ionAutocomplete').fetchSearchQuery("", true);
                    angular.element(ionAutocompleteElement).controller('ionAutocomplete').showModal();
                }
                $scope.getTestItems = function (query, isInitializing) {
                    if (isInitializing) {
                        return {
                            items: []
                        }
                    } else {

                        if (query) {
                            return {
                                items: $scope.filterData(query)
                            };
                        }
                        return {
                            items: []
                        };
                        $scope.$apply;
                    }
                }
                $scope.clickedMethod = function (callback) {
                    $state.go('app.user', {id: callback.item.ID, reveal: 1});
                }
                $scope.filterData = function (data) {

                    APIFactory.searchUser({sterm: data}).then(function (response) {
                        $scope.found = response.data;
                    }, function (error) {
                        $scope.found = [];
                    });
                    return $scope.found;
                }

                $scope.updateUser = function () {
                    if (LSFactory.get('user')) {
                        $rootScope.isLoggedIn = true;
                        $rootScope.user = LSFactory.get('user');
                        $timeout(function () {
                            $rootScope.isLoggedIn = true;
                        }, 200);
                    } else {
                        $rootScope.isLoggedIn = false;
                        $rootScope.user = {};
                        $timeout(function () {
                            $rootScope.isLoggedIn = false;
                        }, 200);
                    }
                };

                $scope.updateUser();


                $rootScope.$on('showLoginModal', function ($event, scope, cancelCallback, callback) {
                    $scope.showLogin = true;
                    $scope.registerToggle = function () {
                        $scope.showLogin = !$scope.showLogin;
                    }
                    $scope = scope || $scope;
                    $scope.viewLogin = true;
                    $ionicModal.fromTemplateUrl('templates/login.html', {
                        scope: $scope
                    }).then(function (modal) {
                        $scope.loginModal = modal;
                        $scope.loginModal.show();
                        $scope.hide = function () {
                            $scope.loginModal.hide();
                            if (typeof cancelCallback === 'function') {
                                cancelCallback();
                            }
                        }
                        $scope.authUser = function (data) {
                            Loader.show('Authenticating')
                            APIFactory.authUser(data).then(function (response) {
                                if (response.data.error) {
                                    Loader.toggleLoadingWithMessage('Invalid Username or Password', 2000);
                                } else if (response.data) {
                                    Loader.toggleLoadingWithMessage('Logged In Successfully', 2000);
                                    $scope.loginModal.hide();
                                    LSFactory.set('user', response.data);
                                    $scope.updateUser();
                                    if (typeof callback === 'function') {
                                        callback();
                                    }
                                } else {
                                    Loader.toggleLoadingWithMessage('Oops! something went wrong. Please try again', 2000);
                                }
                            }, function (error) {
                                console.error(error)
                            })
                        }
                        $scope.registerUser = function (user) {

                            var data = new FormData(jQuery("form.manualRegistration")[0]);
                            Loader.show('Registering ...');
                            APIFactory.registerUser(data).then(function (response) {

                                if (response.data.error) {
                                    Loader.toggleLoadingWithMessage(response.data.error, 2000);
                                } else {
                                    Loader.toggleLoadingWithMessage('Registration Successful', 2000);
                                    var cred = {
                                        logusername: user.useremail,
                                        logpassword: user.password
                                    };
                                    $scope.authUser(cred);
                                }
                            }, function (error) {

                            })
                        }
                    });
                    $scope.facebookLogin = function () {
                        Loader.show();
                        $cordovaOauth.facebook("1756468014619886", ["email", "public_profile"], {
                            redirect_uri: "http://localhost/callback"
                        }).then(function (result) {
                            $http.get("https://graph.facebook.com/v2.2/me", {
                                params: {
                                    access_token: result.access_token,
                                    fields: "name,first_name,last_name,location,picture,email",
                                    format: "json"
                                }
                            }).then(function (result) {
                                $scope.params = {
                                    firstName: result.data.first_name,
                                    lastName: result.data.last_name,
                                    regEmail: result.data.email,
                                    regUserID: result.data.id,
                                    source: 'Facebook'

                                };
                                APIFactory.socialRegister($scope.params).then(function (response) {
                                    $scope.loginModal.hide();
                                    Loader.hide();
                                    Loader.toast('Logged in successfully');
                                    LSFactory.set('user', response.data)
                                    $scope.updateUser();
                                    if (typeof callback === 'function') {
                                        callback();
                                    }
                                }, function (error) {
                                    Loader.hide();
                                })
                            }, function (error) {
                                Loader.hide();
                            });
                        }, function (error) {
                            Loader.hide();
                        });
                    } //end fb login
                    $scope.linkedinLogin = function () {
                        $cordovaOauth.linkedin("817xf6qi41k61f", "i8IMiB94NqXcBeJY", ["r_basicprofile", "r_emailaddress"], "cnHKSsf5fc5n").then(
                                function (result) {
                                    Loader.show();
                                    $scope.param = {
                                        client_id: '817xf6qi41k61f',
                                        client_secret: 'i8IMiB94NqXcBeJY',
                                        redirect_uri: 'http://localhost/callback',
                                        grant_type: 'authorization_code',
                                        code: result
                                    }
                                    APIFactory.linkedinToken($scope.param)
                                            .success(function (result) {
                                                var access_token = result.access_token;
                                                var expire_date = result.expires_in;
                                                APIFactory.linkedInLogin(access_token).then(function (result) {
                                                    $scope.params = {
                                                        firstName: result.data.firstName,
                                                        lastName: result.data.lastName,
                                                        regEmail: result.data.emailAddress,
                                                        regUserID: result.data.id,
                                                        source: 'LinkedIn'
                                                    };
                                                    APIFactory.socialRegister($scope.params).then(function (response) {
                                                        $scope.loginModal.hide();
                                                        Loader.hide();
                                                        Loader.toast('Logged in successfully');
                                                        LSFactory.set('user', response.data)
                                                        $scope.updateUser();
                                                        if (typeof callback === 'function') {
                                                            callback();
                                                        }
                                                    }, function (error) {
                                                        Loader.hide();
                                                    });
                                                }, function (error) {
                                                    Loader.hide();
                                                });
                                            });
                                },
                                function (error) {
                                });
                    };
                });
                $scope.resetPwd = function () {
                    $scope.data = {}
                    // An elaborate, custom popup
                    var myPopup = $ionicPopup.show({
                        template: '<input type="email" ng-model="data.userLogin" placeholder="Enter you email" class="padding">',
                        title: 'Enter your email address',
                        subTitle: 'You will get a link to reset password',
                        scope: $scope,
                        buttons: [{
                                text: 'Cancel',
                                type: 'fs12 reset-btn'
                            }, {
                                text: 'Submit',
                                type: 'button-balanced fs12 reset-btn',
                                onTap: function (e) {
                                    if (!$scope.data.userLogin) {
                                        //don't allow the user to close unless he enters wifi password
                                        e.preventDefault();
                                    } else {
                                        return $scope.data;
                                    }
                                }
                            }, ]
                    });
                    myPopup.then(function (data) {
                        if (!data) {
                            return false;
                        }
                        Loader.show();
                        APIFactory.resetPwd(data).then(function (response) {
                            console.log(response.data);
                            if (response.data.errorType == 'success') {
                                console.log(response.data.errorType);
                                Loader.hide();
                                Loader.toggleLoadingWithMessage('Your password reset link has been sent to your email Id', 2000);
                            } else {
                                Loader.hide();
                                Loader.toggleLoadingWithMessage('This Email Id is not registered', 2000);
                            }
                        }, function (error) {
                            console.error(error);
                            Loader.toggleLoadingWithMessage('Somwthing went wrong. Please try later');
                        })
                    });
                };
                $scope.loginFromMenu = function () {
                    $rootScope.$broadcast('showLoginModal', $scope, null, function () {
                        if ($state.is('app.home')) {
                            try {
                                $scope.$broadcast('refreshHomeData'); //get data using UserID
                            } catch (e) {
                                // statements
                            }
                        }
                        ;
                    });
                };
                $scope.logout = function () {
                    var hideSheet = $ionicActionSheet.show({
                        destructiveText: 'Logout',
                        titleText: 'Are you sure you want to logout?',
                        cancelText: 'Cancel',
                        cancel: function () {
                        },
                        buttonClicked: function (index) {
                            return true;
                        },
                        destructiveButtonClicked: function () {
                            Loader.show();
                            LSFactory.delete('user');
                            hideSheet();
                            $scope.updateUser();
                            if ($state.is('app.polls')) {
                                try {
                                    $scope.$broadcast('refreshHomeData');
                                } catch (e) {
                                }
                            } else {
                                $ionicHistory.nextViewOptions({
                                    disableBack: true,
                                    historyRoot: true
                                });
                                $state.go('app.polls');
                            }
                            Loader.toast('Logged out successfully')
                            Loader.hide();
                        }
                    });
                };
                $scope.toggleGroup = function (group) {
                    if ($scope.isGroupShown(group)) {
                        $scope.shownGroup = null;
                    } else {
                        $scope.shownGroup = group;
                    }
                };
                $scope.isGroupShown = function (group) {
                    return $scope.shownGroup === group;
                };

                function follow(data, e) {
                    APIFactory.follow(data).then(function (response) {
                        Loader.hide();
                        if (response.data.error) {
                            Loader.toast(response.data.error);
                        } else if (response.data.success) {
                            angular.element(e.target).text(response.data.success);
                        } else {
                            Loader.toast('Oops! something went wrong. Please try following again')
                        }
                    },
                            function (error) {
                                Loader.toggleLoadingWithMessage('Oops! something went wrong. Please try following again');
                            });
                }
                $scope.openLink = function (link, e) {
                    e.preventDefault();
                    CommonFactory.inAppLink(link).then(function (response) {
                    }, function (error) {
                    })
                };
                $scope.getRepostedBy = function (pollid) {
                    APIFactory.getRepostedBy({pollId: pollid}).then(function (response) {
                        Loader.hide();
                        $scope.repostedPost = response.data;
                        $scope.data = [1, 2, 3]

                        // An elaborate, custom popup

                        var myPopup = $ionicPopup.show({
                            template: '<div class="list">' +
                                    ' <div class="item item-avatar"  ng-repeat="follwerUsers in repostedPost">' +
                                    '<img ng-src="{{follwerUsers.img}}" ui-sref="app.user({id:follwerUsers.ID, reveal : 1})">' +
                                    ' <h2 ui-sref="app.user({id:follwerUsers.ID, reveal : 1})">{{::follwerUsers.display_name}}</h2>' +
                                    ' </div>' +
                                    ' </div>',
                            title: 'Reposted By:',
                            cssClass: 'reponstedby-popup',
                            buttons: [
                                {text: 'Cancel', type: 'button-energized'}

                            ],
                            scope: $scope

                        });
                        myPopup.then(function (res) {

                        });
                        $rootScope.$on('$locationChangeStart', function (event, next, current) {
                            myPopup.close();
                        });
                    },
                            function (error) {
                                Loader.toggleLoadingWithMessage('Oops! something went wrong. Please try following again');
                            });
                }
                $scope.participate = function (event, id, options) {
                    if (jQuery('.ion-arrow-up-c').attr('data-ref') != id) {
                        var refId = jQuery('.ion-arrow-up-c').attr('data-ref');
                        jQuery('[data-toggle=' + refId + ']').slideToggle();
                        jQuery('[data-ref=' + refId + ']').text('Vote');
                        jQuery('[data-ref=' + refId + ']').removeClass('ion-arrow-up-c').addClass('ion-android-checkmark-circle');
                    }
                    jQuery('[data-toggle=' + id + ']').slideToggle();
                    if (jQuery('[data-ref=' + id + ']').text() == 'Vote') {
                        jQuery('[data-ref=' + id + ']').text('Hide');
                        jQuery('[data-ref=' + id + ']').removeClass('ion-android-checkmark-circle').addClass('ion-arrow-up-c');

                    } else {
                        jQuery('[data-ref=' + id + ']').text('Vote');
                        jQuery('[data-ref=' + id + ']').removeClass('ion-arrow-up-c').addClass('ion-android-checkmark-circle');
                    }
                }
            }])

        .controller('HomeCtrl', ['$scope', 'APIFactory', 'Loader', '$rootScope',
            function ($scope, APIFactory, Loader, $rootScope) {


            }
        ])

        .controller('userProfileCtrl', ['$scope', '$state', '$stateParams', '$timeout', 'APIFactory', 'LSFactory', '$rootScope', 'Loader', '$ionicHistory', '$ionicModal', '$ionicPopover', '$ionicPopup',
            function ($scope, $state, $stateParams, $timeout, APIFactory, LSFactory, $rootScope, Loader, $ionicHistory, $ionicModal, $ionicPopover, $ionicPopup) {
                $scope.canLoadMore = true;
                Loader.show();
                $scope.activePanCat = 'polls';
                $scope.activePan = 'openPolls';
                $scope.reveal = $stateParams.reveal;
                $scope.uid = $stateParams.id;
                $scope.following = 'No';
                $scope.friends = 'No';
                $scope.friend_requested = 'No';
                $scope.getReveal = $stateParams.reveal;
                if (!$rootScope.isLoggedIn)
                    $scope.cid = -1;
                else
                    $scope.cid = LSFactory.get('user').ID;
                $scope.getAllInfo = function () {
                    Loader.show();
                    APIFactory.getUser($stateParams.id).then(function (response) {

                        $scope.userInfo = response.data;
                        if (LSFactory.get('user')) {

                            try {
                                var following = jQuery.grep(response.data.followers, function (element, index) {
                                    return element.user.ID == LSFactory.get('user').ID;
                                });
                                if (following.length || (following.indexOf(LSFactory.get('user').ID) > -1)) {
                                    $scope.following = 'Yes';
                                }
                            } catch (err) {

                            }

                            try {
                                var friends = jQuery.grep(response.data.friends, function (element, index) {
                                    return element.ID == LSFactory.get('user').ID;
                                });
                                if (friends.length || (friends.indexOf(LSFactory.get('user').ID) > -1)) {
                                    $scope.friends = 'Yes';
                                }

                            } catch (err) {

                            }

                            try {

                                var friend_requested = jQuery.grep(response.data.friend_requests_received, function (element, index) {
                                    return element.ID == LSFactory.get('user').ID;
                                });
                                if (friend_requested.length || (friend_requested.indexOf(LSFactory.get('user').ID) > -1)) {
                                    $scope.friend_requested = 'Yes';
                                }
                            } catch (err) {

                            }


                        }
                        Loader.hide();


                    }, function (data) {
                        $scope.canLoadMore = false;
                        Loader.hide();
                        Loader.toast('Oops! something went wrong');
                    });
                }
                $scope.getAllInfo();
                $scope.getUserInfo = function () {

                    APIFactory.getUser($stateParams.id).then(function (response) {
                        $scope.userInfo = response.data;
                    });

                }
                $scope.followUser = function (uid) {
                    Loader.show();
                    APIFactory.follow({uid: $scope.uid, cid: LSFactory.get('user').ID}).then(function (response) {
                        if (response.data.error) {
                            Loader.toggleLoadingWithMessage(response.data.error, 2000);
                        } else {
                            Loader.toggleLoadingWithMessage(response.data.success, 2000);
                            $scope.getUserInfo();
                        }
                    });
                }
                $scope.unFollowUser = function (uid, index) {
                    Loader.show();
                    APIFactory.unfollow({uid: uid, cid: LSFactory.get('user').ID}).then(function (response) {
                        if (response.data.error) {
                            Loader.toggleLoadingWithMessage(response.data.error, 2000);
                        } else {
                            Loader.toggleLoadingWithMessage(response.data.success, 2000);
                            $scope.getUserInfo();


                        }
                    });
                }
                $scope.friendRequestAccept = function (uid, index) {
                    Loader.show();
                    APIFactory.friendRequestAccept({uid: uid, cid: LSFactory.get('user').ID}).then(function (response) {
                        if (response.data.error) {
                            Loader.toggleLoadingWithMessage(response.data.error, 2000);
                        } else {
                            Loader.toggleLoadingWithMessage(response.data.success, 2000);
                            $scope.getUserInfo();
                        }
                    });
                }
                $scope.friendRequestReject = function (uid, index) {
                    Loader.show();
                    APIFactory.friendRequestReject({uid: uid, cid: LSFactory.get('user').ID}).then(function (response) {
                        if (response.data.error) {
                            Loader.toggleLoadingWithMessage(response.data.error, 2000);
                        } else {
                            Loader.toggleLoadingWithMessage(response.data.success, 2000);
                            $scope.getUserInfo();
                        }
                    });
                }
                $scope.unFriend = function (uid, index) {
                    var confirmPopup = $ionicPopup.confirm({
                        title: 'Confirmation',
                        template: 'Are you sure you want to unfriend?'
                    });
                    confirmPopup.then(function (res) {
                        if (res) {
                            Loader.show();
                            APIFactory.unFriend({uid: uid, cid: LSFactory.get('user').ID}).then(function (response) {
                                if (response.data.error) {
                                    Loader.toggleLoadingWithMessage(response.data.error, 2000);
                                } else {
                                    $scope.friend_requested = "No";
                                    $scope.friends = "No";
                                    Loader.toggleLoadingWithMessage(response.data.success, 2000);
                                    $scope.getUserInfo();
                                }
                            });
                        }
                    });
                }

                $scope.friendRequest = function (uid, index) {
                    Loader.show();
                    APIFactory.addFriend({uid: uid, cid: LSFactory.get('user').ID}).then(function (response) {
                        if (response.data.error) {
                            Loader.toggleLoadingWithMessage(response.data.error, 2000);
                        } else {
                            Loader.toggleLoadingWithMessage(response.data.success, 2000);
                            $scope.getAllInfo();

                        }
                    });
                }
                $scope.getPollsByType = function (type, pageNumber) {
                    $scope.pollsPara = {userId: $stateParams.id};
                    $scope.pollsPara.pageNo = pageNumber || 1;
                    if ($scope.uid != $scope.cid) {
                        $scope.pollsPara.anonymous = 'No';
                    }
                    if ($scope.pollsPara.pageNo == 1 || ($scope.pollsPara.type != type && type != 'getUserPollParticipate')) {
                        Loader.show();
                    }
                    $scope.pollsPara.type = type || 'open';

                    APIFactory.getPollsByType($scope.pollsPara).then(function (response) {
                        if ($scope.pollsPara.pageNo > 1) {
                            try {
                                if (!response.data.length) {
                                    $scope.canLoadMore = false;
                                } else {
                                    angular.forEach(response.data, function (element, index) {
                                        $scope.polls.push(element);
                                    });
                                }
                            } catch (e) {
                            }

                        } else {
                            $scope.polls = [];

                            angular.forEach(response.data, function (element, index) {

                                $scope.polls.push(element);

                            });
                        }
                        Loader.hide();
                    }, function (data) {
                        Loader.hide();
                        Loader.toast('Oops! something went wrong');
                    }).finally(function () {
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                        $scope.$broadcast('scroll.refreshComplete');
                    });
                }
                $scope.getPollsByType();
                $scope.updatePan = function (tab, type, cat) {
                    $scope.activePan = tab;
                    $scope.type = type;
                    if (cat == 'polls') {
                        $scope.canLoadMore = true;

                        $scope.getPollsByType(type);
                    }
                    if (tab == 'following' || tab == 'followers' || tab == 'profile') {
                        $scope.activePanCat = '';
                    }
                }

                $scope.performTask = function (type, pollid, poll) {
                    if (!$rootScope.isLoggedIn) {
                        $rootScope.$broadcast('showLoginModal', $scope, function () {
                            $ionicHistory.goBack(-1);
                        }, function () {
                            if (type == 'like') {
                                likePoll(pollid, poll);
                            } else if (type == 'notify') {
                                notifyMe(pollid);
                            } else if (type == 'unlike') {
                                UnlikePoll(pollid, poll);
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
                            likePoll(pollid, poll);
                        } else if (type == 'notify') {
                            notifyMe(pollid);
                        } else if (type == 'unlike') {
                            UnlikePoll(pollid, poll);
                        } else if (type == 'unNotifyMe') {
                            unNotifyMe(pollid);
                        } else if (type == 'repost') {
                            repost(pollid);
                        } else if (type == 'report') {
                            reportContent(pollid);
                        } else if (type == 'delete') {
                            $scope.deletePoll(pollid);
                        }
                    }
                };

                $scope.deletePoll = function (pollid) {
                    var confirmPopup = $ionicPopup.confirm({
                        title: 'Confirmation',
                        template: 'Are you sure you want to delete this poll?'
                    });
                    confirmPopup.then(function (res) {
                        if (res) {
                            Loader.show();
                            var data = {pollId: pollid, userId: LSFactory.get('user').ID};
                            Loader.show();
                            APIFactory.deletePoll(data).then(function (response) {
                                if (response.data.error) {
                                    Loader.toggleLoadingWithMessage(response.data.msg, 2000);
                                    $scope.popover.hide();
                                } else {
                                    Loader.toggleLoadingWithMessage(response.data.msg, 2000);
                                    $scope.popover.hide();
                                    $scope.getPollsByType();

                                }
                            });
                        }
                    });
                }

                function likePoll(pollid, poll) {

                    var data = {pollid: pollid, userId: LSFactory.get('user').ID};
                    Loader.show();
                    APIFactory.likePoll(data).then(function (response) {
                        if (response.data.error) {
                            Loader.toggleLoadingWithMessage(response.data.error, 2000);
                            $scope.popover.hide();
                        } else {
                            Loader.toggleLoadingWithMessage(response.data.success, 2000);
                            $scope.popover.hide();
                            $scope.pollLiked = !$scope.pollLiked;
                            $scope.getPollsByType();

                        }
                    });
                }

                function repost(pollid) {
                    var data = {pollid: pollid, userId: LSFactory.get('user').ID};
                    Loader.show();
                    APIFactory.repost(data).then(function (response) {
                        if (response.data.error) {
                            Loader.toggleLoadingWithMessage(response.data.error, 2000);
                        } else {
                            Loader.toggleLoadingWithMessage(response.data.success, 2000);
                        }
                    });
                }

                function reportContent(pollid) {
                    var data = {pollid: pollid, userId: LSFactory.get('user').ID};
                    Loader.show();
                    APIFactory.flag(data).then(function (response) {
                        if (response.data.error) {
                            Loader.toggleLoadingWithMessage(response.data.error, 2000);
                        } else {
                            Loader.toggleLoadingWithMessage(response.data.success, 2000);
                        }
                    });
                }

                function UnlikePoll(pollid, poll) {

                    var data = {pollid: pollid, userId: LSFactory.get('user').ID};
                    Loader.show();
                    APIFactory.unlikePoll(data).then(function (response) {
                        if (response.data.error) {
                            Loader.toggleLoadingWithMessage(response.data.error, 2000);
                        } else {
                            Loader.toggleLoadingWithMessage(response.data.success, 2000);


                            $scope.getPollsByType();
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
                        } else {
                            Loader.toggleLoadingWithMessage(response.data.success, 2000);
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
                        } else {
                            Loader.toggleLoadingWithMessage(response.data.success, 2000);
                            $scope.pollNotify = !$scope.pollNotify;


                        }
                    });
                }


                $scope.vote = function (pid, oid, index, getIndex) {
                    if (!$rootScope.isLoggedIn) {
                        $rootScope.$broadcast('showLoginModal', $scope, function () {
                            $ionicHistory.goBack(-1);
                        }, function () {
                            vote(pid, oid, index);
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
                            $timeout(function () {
                                $scope.polls[getIndex].options = response.data;
                                $scope.polls[getIndex].participants.push($scope.uid);
                            }, 200)

                        }
                    });
                }
                $ionicPopover.fromTemplateUrl('templates/common-template.html', {
                    scope: $scope
                }).then(function (popover) {
                    $scope.popover = popover;
                });

                $scope.openPopover = function ($event, poll) {
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

                $scope.updateCat = function (tab) {
                    if (tab == 'friends') {
                        $scope.activePan = 'allfrnd';
                    } else if (tab == 'polls') {

                        $scope.activePan = 'openPolls';
                    }
                    $scope.activePanCat = tab;
                }


                $scope.follow = function () {
                    if (!$rootScope.isLoggedIn) {
                        $rootScope.$broadcast('showLoginModal', $scope, function () {
                            $ionicHistory.goBack(-1);
                        }, function () {
                            follow();
                        });
                    } else {
                        follow();
                    }
                }

                function follow() {
                    Loader.show();
                    APIFactory.follow({uid: $scope.uid, cid: LSFactory.get('user').ID, following: $scope.reveal}).then(function (response) {
                        if (response.data.error) {
                            Loader.toggleLoadingWithMessage(response.data.error, 2000);
                        } else {
                            Loader.toggleLoadingWithMessage(response.data.success, 2000);
                            $scope.following = 'Yes';
                            $scope.userInfo.followers = response.data.followers;
                        }
                    });
                }


                $scope.unfollow = function () {
                    if (!$rootScope.isLoggedIn) {
                        $rootScope.$broadcast('showLoginModal', $scope, function () {
                            $ionicHistory.goBack(-1);
                        }, function () {
                            unfollow();
                        });
                    } else {
                        unfollow();
                    }
                }

                function unfollow() {
                    Loader.show();
                    APIFactory.unfollow({uid: $scope.uid, cid: LSFactory.get('user').ID}).then(function (response) {
                        if (response.data.error) {
                            Loader.toggleLoadingWithMessage(response.data.error, 2000);
                        } else {
                            Loader.toggleLoadingWithMessage(response.data.success, 2000);
                            $scope.following = 'No';
                            $scope.userInfo.followers = response.data.followers;
                        }
                    });
                }
                $scope.formData = {};
                $scope.modifyUser = function (data) {
                    var data = new FormData(jQuery("form.updateUserProfile")[0]);
                    data.append('userId', LSFactory.get('user').ID);
                    // data.profileImg = jQuery('#profileImg').val();
                    Loader.show();
                    APIFactory.updateUserProfile(data).then(function (response) {
                        Loader.toggleLoadingWithMessage(response.data.msg, 2000);
                    });
                }
                $scope.changePassword = function (password) {
                    Loader.show();
                    var uId = LSFactory.get('user').ID;
                    APIFactory.updateUserPassword(uId, password).then(function (response) {
                        Loader.toggleLoadingWithMessage(response.data.msg, 2000);
                    });
                }

            }
        ])

        .controller('contactCtrl', ['$scope', 'Loader', 'APIFactory', '$state', '$ionicHistory',
            function ($scope, Loader, APIFactory, $state, $ionicHistory) {
                $scope.message = {};
                $scope.sendMail = function () {
                    Loader.show();
                    APIFactory.sendContactMail($scope.message).then(function (response) {
                        Loader.hide();
                        //  Loader.toast('Message sent successfuly');
                        Loader.toggleLoadingWithMessage(response.data.msg, 2000);
                        $scope.message = {};
                        $ionicHistory.nextViewOptions({
                            disableBack: true,
                            historyRoot: true
                        });
                        $state.go('app.home');
                    }, function (error) {
                        Loader.hide();
                        Loader.toast('Oops! something went wrong. Please try later again');
                    })
                }
            }
        ])

        .controller('pollsCtrl', ['$ionicNavBarDelegate', '$scope', '$state', '$timeout', 'APIFactory', 'LSFactory', '$rootScope', 'Loader', '$ionicHistory', '$ionicModal', '$ionicPopover', '$ionicScrollDelegate', '$ionicPopup',
            function ($ionicNavBarDelegate, $scope, $state, $timeout, APIFactory, LSFactory, $rootScope, Loader, $ionicHistory, $ionicModal, $ionicPopover, $ionicScrollDelegate, $ionicPopup) {
                $scope.pageNumber = 1;
                $scope.canLoadMore = false;
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

                    console.log($scope.canLoadMore);

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
                    APIFactory.getPolls($scope.filters, $scope.pageNumber, $scope.orderBy, $scope.userId).then(function (response) {
                        if ($scope.pageNumber > 1) {
                            if (!response.data.length) {
                                $scope.canLoadMore = false;
                            } else {

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
                            vote(pid, oid, index);
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

        .controller('frequestsCtrl', ['$scope', '$state', '$timeout', 'APIFactory', 'LSFactory', '$rootScope', 'Loader', '$ionicHistory', '$ionicModal', '$ionicPopover', '$ionicScrollDelegate',
            function ($scope, $state, $timeout, APIFactory, LSFactory, $rootScope, Loader, $ionicHistory, $ionicModal, $ionicPopover, $ionicScrollDelegate) {
                $scope.getUserInfo = function () {

                    Loader.show();
                    $scope.userId = LSFactory.get('user').ID;
                    APIFactory.getUser($scope.userId).then(function (response) {
                        $rootScope.user.friend_requests_received = response.data.friend_requests_received;
                        Loader.hide();
                    });
                }
                $scope.getUserInfo();
                $scope.friendRequestAccept = function (uid, index) {
                    Loader.show();
                    APIFactory.friendRequestAccept({uid: uid, cid: LSFactory.get('user').ID}).then(function (response) {
                        if (response.data.error) {
                            Loader.toggleLoadingWithMessage(response.data.error, 2000);
                        } else {
                            Loader.toggleLoadingWithMessage(response.data.success, 2000);
                            $scope.getUserInfo();
                        }
                    });
                }
                $scope.friendRequestReject = function (uid, index) {
                    Loader.show();
                    APIFactory.friendRequestReject({uid: uid, cid: LSFactory.get('user').ID}).then(function (response) {
                        if (response.data.error) {
                            Loader.toggleLoadingWithMessage(response.data.error, 2000);
                        } else {
                            Loader.toggleLoadingWithMessage(response.data.success, 2000);
                            $scope.getUserInfo();
                        }
                    });
                }
            }
        ])

        .controller('formeCtrl', ['$scope', '$state', '$timeout', 'APIFactory', 'LSFactory', '$rootScope', 'Loader', '$ionicHistory', '$ionicModal', '$ionicPopover', '$ionicScrollDelegate',
            function ($scope, $state, $timeout, APIFactory, LSFactory, $rootScope, Loader, $ionicHistory, $ionicModal, $ionicPopover, $ionicScrollDelegate) {
                $scope.pageNumber = 1;
                $scope.canLoadMore = true;
                $scope.uid = LSFactory.get('user').ID;
                if (!$rootScope.isLoggedIn) {
                    $rootScope.$broadcast('showLoginModal', $scope, function () {
                        $ionicHistory.goBack(-1);
                    }, function () {
                        $scope.getPolls();
                    });
                } else {
                    var type = '';
                    if (type == 'infScr') {
                        $scope.pageNumber = $scope.pageNumber + 1;
                    }
                    if (type == 'pullRef') {
                        $scope.pageNumber = 1;
                        $scope.canLoadMore = true;
                    }

                    if ($scope.pageNumber == 1 && type != 'pullRef') {
                        Loader.show();
                    }

                    APIFactory.forme(LSFactory.get('user').ID, $scope.pageNumber).then(function (response) {
                        if ($scope.pageNumber > 1) {
                            if (!response.data.length) {
                                $scope.canLoadMore = false;
                            } else {
                                angular.forEach(response.data, function (element, index) {
                                    $scope.polls.push(element);
                                });
                            }
                        } else {
                            $scope.polls = response.data;
                            a = $scope.polls;
                        }
                        Loader.hide();
                    }, function (error) {
                        Loader.hide();
                        Loader.toast('Oops! something went wrong. Please try later again');
                    }).finally(function () {
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                        $scope.$broadcast('scroll.refreshComplete');
                    });
                }


                $scope.getPolls = function (type) {
                    if (type == 'infScr') {
                        $scope.pageNumber = $scope.pageNumber + 1;
                    }
                    if (type == 'pullRef') {
                        $scope.pageNumber = 1;
                        $scope.canLoadMore = true;
                    }

                    if ($scope.pageNumber == 1 && type != 'pullRef') {
                        Loader.show();
                    }

                    APIFactory.forme(LSFactory.get('user').ID, $scope.pageNumber).then(function (response) {
                        if ($scope.pageNumber > 1) {
                            if (!response.data.length) {
                                $scope.canLoadMore = false;
                            } else {
                                angular.forEach(response.data, function (element, index) {
                                    $scope.polls.push(element);
                                });
                            }
                        } else {
                            $scope.polls = response.data;
                            a = $scope.polls;
                        }
                        Loader.hide();
                    }, function (error) {
                        Loader.hide();
                        Loader.toast('Oops! something went wrong. Please try later again');
                    }).finally(function () {
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                        $scope.$broadcast('scroll.refreshComplete');
                    });

                }


                $scope.getFilteredPolls = function () {
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
                $scope.getPollsFilters = function () {
                    Loader.show();

                    APIFactory.getInterests().then(function (response) {
                        $scope.interests = response.data;
                        Loader.hide();
                    }, function (error) {
                        Loader.hide();
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

                $scope.vote = function (pid, oid, index) {
                    if (!$rootScope.isLoggedIn) {
                        $rootScope.$broadcast('showLoginModal', $scope, function () {
                            $ionicHistory.goBack(-1);
                        }, function () {
                            vote(pid, oid, index);
                        });
                    } else {
                        vote(pid, oid, index);
                    }
                };

                function vote(pid, oid, poll) {
                    var index = $scope.polls.indexOf(poll);
                    var data = new FormData(jQuery("form.vote" + pid)[0]);
                    data.append('userId', LSFactory.get('user').ID);
                    Loader.show('Submitting Your Vote ...');
                    APIFactory.vote(data).then(function (response) {
                        if (response.data.error) {
                            Loader.toggleLoadingWithMessage(response.data.error, 2000);
                        } else {
                            Loader.toggleLoadingWithMessage('Voted Successfully', 1000);
                            $scope.polls[index].participants.push($scope.uid);

                        }
                    });
                }
                ;
                $ionicPopover.fromTemplateUrl('templates/common-template.html', {
                    scope: $scope
                }).then(function (popover) {
                    $scope.popover = popover;
                });
                $scope.openPopover = function ($event, poll) {
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

        .directive('onFinishRender', function ($timeout) {
            return {
                restrict: 'A',
                link: function (scope, element, attr) {
                    if (scope.$last === true) {
                        $timeout(function () {
                            scope.$emit(attr.onFinishRender);
                        });
                    }
                }
            }
        })


        .controller('createPollCtrl', ['$scope', '$state', '$timeout', 'APIFactory', 'LSFactory', '$rootScope', 'Loader', '$ionicHistory', '$ionicScrollDelegate',
            function ($scope, $state, $timeout, APIFactory, LSFactory, $rootScope, Loader, $ionicHistory, $ionicScrollDelegate) {
                $scope.acitveTab = 'tab1';
                $scope.posted_as = 1;
                Loader.show();
                $scope.ptype = '';


                APIFactory.getInterests().then(function (response) {
                    $scope.interests = response.data;
//                    $scope.addOption();
//                    $scope.addOption();
                    Loader.hide();
                }, function (error) {
                    Loader.hide();
                    Loader.toast('Oops! something went wrong. Please try later again');
                });
                APIFactory.getPollType().then(function (response) {
                    $scope.pollTypes = response.data;
                    Loader.hide();
                }, function (error) {
                    Loader.hide();
                    Loader.toast('Oops! something went wrong. Please try later again');
                });

                $scope.manageTabs = function (activeTab, type) {
                    $scope.userId = LSFactory.get('user').ID;
                    if (typeof (activeTab) != 'undefined') {
                        ptype = activeTab;
                    }
                    if (typeof (type) != 'undefined' && type == 'cloneBlock') {
                        $scope.addOption('Yes');
                        $scope.addOption('No');
                    }
                    $scope.ptype = ptype;
                    $scope.ptype = activeTab;
                    $scope.checkTab = activeTab;
                    if (type == 'nav') {
                        $scope.$digest;
                    } else {
                        if ($scope.acitveTab == 'tab1') {
                            $scope.acitveTab = 'tab2';
                        } else if ($scope.acitveTab == 'tab2') {
                            $scope.acitveTab = 'tab3';
                            jQuery('#pollquestion').focus();
                        }
                    }
                    $ionicScrollDelegate.scrollTop();

                }
                $scope.selectOption = function (event) {


                }
                $scope.createPoll = function () {
                    if (!$rootScope.isLoggedIn) {
                        $rootScope.$broadcast('showLoginModal', $scope, function () {
                            $ionicHistory.goBack(-1);
                        }, function () {
                            newPoll();
                        });
                    } else {
                        newPoll();
                    }
                }

                function newPoll() {
                    //var data = jQuery("#createPoll").serialize();

                    var data = new FormData(jQuery("form.createPoll")[0]);
                    data.append('userId', LSFactory.get('user').ID);
                    Loader.show('Creating Poll ...');
                    APIFactory.createPoll(data).then(function (response) {

                        if (response.data.error) {
                            Loader.toggleLoadingWithMessage(response.data.error, 2000);
                        } else {
                            Loader.toggleLoadingWithMessage(response.data.success, 2000);
                            $timeout(function () {
                                $state.go('app.polls', {}, {reload: true});
                            }, 1000)


                        }

                    });
                }

                var options = {};
                var inputFrom = document.getElementById('from');
                var autocompleteFrom = new google.maps.places.Autocomplete(inputFrom, options);
                google.maps.event.addListener(autocompleteFrom, 'place_changed', function () {
                    var place = autocompleteFrom.getPlace();
                    $scope.lat = place.geometry.location.lat();
                    $scope.lng = place.geometry.location.lng();
                });


                $scope.addOption = function (data) {
    
                    if (ptype == 1) {
                        jQuery(".options").append(jQuery(".cloneMultiChoice").html());
                        indexOptionsMultiChoice('optionMultiChoice');
                    }

                    if (ptype == 2) {
                        jQuery(".options").append(jQuery(".cloneWithImage").html());
                        indexOptionsMultiChoice('optionWithImage');
                    }

                    if (ptype == 3) {
                        jQuery(".options").append(jQuery(".cloneReferendum").html());
                        indexOptionsMultiChoice('optionReferendum');


                    }
                    if (ptype == 4) {
                        jQuery('.minimumText').hide();
                        jQuery('.addOptions').hide();
                        jQuery(".options").append(jQuery(".cloneYesNo").html());
                        indexOptionsMultiChoice('optionYesNo', data);
                    }

                }





            }
        ])




