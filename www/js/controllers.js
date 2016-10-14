var a;

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
                                Loader.toast('Shared Successfully');
                            }, function (err) {
                                Loader.toast('Ooops ... Looks like something went wrong!');

                            });
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
                                    Loader.toggleLoadingWithMessage('Authentication Successful', 2000);
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
                                    Loader.toast('Logged in successfuly');
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
                            console.log(error);
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
                                                        Loader.toast('Logged in successfuly');
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
                                    console.log(error);
                                });
                    };
                });
                $scope.resetPwd = function () {
                    $scope.data = {}
                    // An elaborate, custom popup
                    var myPopup = $ionicPopup.show({
                        template: '<input type="email" ng-model="data.regEmail" placeholder="Enter you email" class="padding">',
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
                                    if (!$scope.data.regEmail) {
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
                            if (response.data == 1) {
                                Loader.hide();
                                Loader.toast('Your password reset link has been sent to your email Id');
                            } else {
                                Loader.hide();
                                Loader.toast('This Email Id is not registered');
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
                                console.log(e);
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
                        cancel: function () {},
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
                                    console.log(e);
                                }
                            } else {
                                $ionicHistory.nextViewOptions({
                                    disableBack: true,
                                    historyRoot: true
                                });
                                $state.go('app.polls');
                            }
                            Loader.toast('Logged out successfuly')
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
                    CommonFactory.inAppLink(link).then(function (response) {}, function (error) {
                        console.log(error);
                    })
                };
            }
        ])

        .controller('HomeCtrl', ['$scope', 'APIFactory', 'Loader', '$rootScope',
            function ($scope, APIFactory, Loader, $rootScope) {


            }
        ])

        .controller('userProfileCtrl', ['$scope', '$state', '$stateParams', '$timeout', 'APIFactory', 'LSFactory', '$rootScope', 'Loader', '$ionicHistory',
            function ($scope, $state, $stateParams, $timeout, APIFactory, LSFactory, $rootScope, Loader, $ionicHistory) {

                Loader.show();
                $scope.activePanCat = 'polls';
                $scope.activePan = 'openPolls';
                $scope.reveal = $stateParams.reveal;
                $scope.uid = $stateParams.id;
                $scope.following = 'No';
                $scope.friends = 'No';
                $scope.friend_requested = 'No';

                if (!$rootScope.isLoggedIn)
                    $scope.cid = -1;
                else
                    $scope.cid = LSFactory.get('user').ID;

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

                            var friend_requested = jQuery.grep(response.data.friend_requests, function (element, index) {
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
                    Loader.hide();
                    Loader.toast('Oops! something went wrong');
                });


                $scope.updatePan = function (tab) {
                    $scope.activePan = tab;
                    if (tab == 'following' || tab == 'followers' || tab == 'profile') {
                        $scope.activePanCat = '';

                    }
                }
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
            }
        ])

        .controller('contactCtrl', ['$scope', 'Loader', 'APIFactory', '$state', '$ionicHistory',
            function ($scope, Loader, APIFactory, $state, $ionicHistory) {
                $scope.message = {};
                $scope.sendMail = function () {
                    Loader.show();
                    APIFactory.sendContactMail($scope.message).then(function (response) {
                        Loader.hide();
                        Loader.toast('Message sent successfuly');
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

        .controller('pollsCtrl', ['$scope', '$state', '$timeout', 'APIFactory', 'LSFactory', '$rootScope', 'Loader', '$ionicHistory', '$ionicModal', '$ionicPopover', '$ionicScrollDelegate',
            function ($scope, $state, $timeout, APIFactory, LSFactory, $rootScope, Loader, $ionicHistory, $ionicModal, $ionicPopover, $ionicScrollDelegate) {
                $scope.pageNumber = 1;
                $scope.canLoadMore = true;
                $scope.filters = '';
                $scope.orderBy = '';
                $scope.getPolls = function (type) {
                    console.log(type);
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
                    $scope.uid = '';
                    if (LSFactory.get('user')) {
                        $scope.filters.userId = LSFactory.get('user').ID;
                        $scope.uid = parseInt(LSFactory.get('user').ID);
                    }
                    APIFactory.getPolls($scope.filters, $scope.pageNumber, $scope.orderBy).then(function (response) {
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
                    ;
                }
                $scope.getPolls();

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

                $scope.participate = function (event, id, options) {
                    jQuery('[data-toggle=' + id + ']').slideToggle();
                    if (angular.element(event.target).text() == 'Vote') {
                        angular.element(event.target).text('Hide');
                        angular.element(event.target).removeClass('ion-paper-airplane').addClass('ion-arrow-up-c');

                    } else {
                        angular.element(event.target).text('Vote');
                        angular.element(event.target).removeClass('ion-arrow-up-c').addClass('ion-paper-airplane');
                    }
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
                        } else {
                            Loader.toggleLoadingWithMessage(response.data.success, 2000);
                            $scope.pollLiked = !$scope.pollLiked;
                            $scope.getPolls();

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
                function UnlikePoll(pollid) {
                    var data = {pollid: pollid, userId: LSFactory.get('user').ID};
                    Loader.show();
                    APIFactory.unlikePoll(data).then(function (response) {
                        if (response.data.error) {
                            Loader.toggleLoadingWithMessage(response.data.error, 2000);
                        } else {
                            Loader.toggleLoadingWithMessage(response.data.success, 2000);
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

                $scope.vote = function (pid) {
                    console.log('asdf');
                    if (!$rootScope.isLoggedIn) {
                        $rootScope.$broadcast('showLoginModal', $scope, function () {
                            $ionicHistory.goBack(-1);
                        }, function () {
                            vote(pid);
                        });
                    } else {
                        vote(pid);
                    }
                };

                function vote(pid) {
                    var data = new FormData(jQuery("form.vote" + pid)[0]);
                    data.append('userId', LSFactory.get('user').ID);
                    Loader.show('Submitting Your Vote ...');
                    APIFactory.vote(data).then(function (response) {
                        if (response.data.error) {
                            Loader.toggleLoadingWithMessage(response.data.error, 2000);
                        } else {
                            Loader.toggleLoadingWithMessage(response.data.success, 2000);
                            jQuery("form.vote" + pid).hide();
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
                    console.log('openFilters')
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
                Loader.show();
                $scope.userId = LSFactory.get('user').ID;

                APIFactory.getUser($scope.userId).then(function (response) {
                    $rootScope.user.friend_requests_received = response.data.friend_requests_received;
                    Loader.hide();
                });
            }])

        .controller('formeCtrl', ['$scope', '$state', '$timeout', 'APIFactory', 'LSFactory', '$rootScope', 'Loader', '$ionicHistory', '$ionicModal', '$ionicPopover', '$ionicScrollDelegate',
            function ($scope, $state, $timeout, APIFactory, LSFactory, $rootScope, Loader, $ionicHistory, $ionicModal, $ionicPopover, $ionicScrollDelegate) {
                $scope.pageNumber = 1;
                $scope.canLoadMore = true;


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

                $scope.participate = function (event, id, options) {
                    jQuery('[data-toggle=' + id + ']').slideToggle();
                    if (angular.element(event.target).text() == 'Vote') {
                        angular.element(event.target).text('Hide');
                        angular.element(event.target).removeClass('ion-paper-airplane').addClass('ion-arrow-up-c');

                    } else {
                        angular.element(event.target).text('Vote');
                        angular.element(event.target).removeClass('ion-arrow-up-c').addClass('ion-paper-airplane');
                    }
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
                        } else {
                            Loader.toggleLoadingWithMessage(response.data.success, 2000);
                            $scope.pollLiked = !$scope.pollLiked;
                            $scope.getPolls();

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
                function UnlikePoll(pollid) {
                    var data = {pollid: pollid, userId: LSFactory.get('user').ID};
                    Loader.show();
                    APIFactory.unlikePoll(data).then(function (response) {
                        if (response.data.error) {
                            Loader.toggleLoadingWithMessage(response.data.error, 2000);
                        } else {
                            Loader.toggleLoadingWithMessage(response.data.success, 2000);
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

                $scope.vote = function (pid) {
                    console.log('asdf');
                    if (!$rootScope.isLoggedIn) {
                        $rootScope.$broadcast('showLoginModal', $scope, function () {
                            $ionicHistory.goBack(-1);
                        }, function () {
                            vote(pid);
                        });
                    } else {
                        vote(pid);
                    }
                };

                function vote(pid) {
                    var data = new FormData(jQuery("form.vote" + pid)[0]);
                    data.append('userId', LSFactory.get('user').ID);
                    Loader.show('Submitting Your Vote ...');
                    APIFactory.vote(data).then(function (response) {
                        if (response.data.error) {
                            Loader.toggleLoadingWithMessage(response.data.error, 2000);
                        } else {
                            Loader.toggleLoadingWithMessage(response.data.success, 2000);
                            jQuery("form.vote" + pid).hide();
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
                    console.log('openFilters')
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
                Loader.show();

                APIFactory.getInterests().then(function (response) {
                    $scope.interests = response.data;
                    $scope.addOption();
                    $scope.addOption();
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
                    if (type == 'nav') {
                        console.log(activeTab + type);
                        $scope.acitveTab = activeTab;
                        console.log($scope.acitveTab);
                        $scope.$digest;
                    } else {
                        if ($scope.acitveTab == 'tab1') {
                            $scope.acitveTab = 'tab2';
                        } else if ($scope.acitveTab == 'tab2') {
                            $scope.acitveTab = 'tab3';
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
                    var data = new FormData(jQuery("form.createPoll")[0]);
                    data.append('userId', LSFactory.get('user').ID);
                    Loader.show('Creating Poll ...');
                    APIFactory.createPoll(data).then(function (response) {

                        if (response.data.error) {
                            Loader.toggleLoadingWithMessage(response.data.error, 2000);
                        } else {
                            Loader.toggleLoadingWithMessage(response.data.success, 2000);
                            $timeout(function () {
                                window.location.reload();
                            }, 1000)


                        }

                    });
                }
                $scope.$on('gmPlacesAutocomplete::placeChanged', function (aasdf) {
                
                    var location = aasdf.getPlace();
                    console.log(location);
                    $scope.lat = location.lat();
                    $scope.lng = location.lng();
                    $scope.$apply();

                });
                $scope.addOption = function () {
                    jQuery(".options").append(jQuery(".toClone").html());
                    indexOptions();
                }

            }
        ])
