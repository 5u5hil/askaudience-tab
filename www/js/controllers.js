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
                $ionicPopover.fromTemplateUrl('templates/common-template.html', {
                    scope: $scope
                }).then(function (popover) {
                    $scope.popover = popover;
                });

                $scope.openPopover = function ($event) {
                    $scope.popover.show($event);
                };

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
                        cancel: function () { },
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
                    CommonFactory.inAppLink(link).then(function (response) { }, function (error) {
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


                // if (!$rootScope.isLoggedIn) {
                //     $rootScope.$broadcast('showLoginModal', $scope, function () {
                //         $ionicHistory.goBack(-1);
                //     }, function () {
                //         getUserData();
                //     });
                // } else {
                //     getUserData();
                // }

                // function getUserData() {
                //     Loader.show();
                //     APIFactory.userData($rootScope.user.ID).then(function (response) {
                //         Loader.hide();
                //         $scope.userInfo = response.data;
                //     }, function (data) {
                //         /* body... */
                //         Loader.hide();
                //         Loader.toast('Oops! something went wrong');
                //     })
                // };
                // $scope.updateUser = function (data) {
                //     var password = {
                //         pass: '',
                //         repass: ''
                //     };
                //     Loader.show();
                //     APIFactory.updateUser(data, password, $rootScope.user.ID).then(function (response) {
                //         console.log(response);
                //         Loader.hide();
                //         Loader.toast('Profile updated successfuly');
                //     }, function (error) {
                //         console.log(error);
                //         Loader.hide();
                //         Loader.toast('Oops! something went wrong. Please try later again');
                //     })
                // }
                // $scope.changePassword = function (data, password) {
                //     Loader.show();
                //     APIFactory.updateUser(data, password, $rootScope.user.ID).then(function (response) {
                //         console.log(response);
                //         Loader.hide();
                //         Loader.toast('Password updated successfuly');
                //     }, function (error) {
                //         console.log(error);
                //         Loader.hide();
                //         Loader.toast('Oops! something went wrong. Please try later again');
                //     })
                // }
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

        .controller('pollsCtrl', ['$scope', '$state', '$timeout', 'APIFactory', 'LSFactory', '$rootScope', 'Loader', '$ionicHistory',
            function ($scope, $state, $timeout, APIFactory, LSFactory, $rootScope, Loader, $ionicHistory) {
                Loader.show();
                var data = {};

                if (LSFactory.get('user'))
                    data.userId = LSFactory.get('user').ID

                APIFactory.getPolls(data).then(function (response) {
                    $scope.polls = response.data;
                    Loader.hide();
                }, function (error) {
                    Loader.hide();
                    Loader.toast('Oops! something went wrong. Please try later again');
                })
            }
        ])

        .controller('pollDetailsCtrl', ['$scope', '$state', '$stateParams', '$timeout', 'APIFactory', 'LSFactory', '$rootScope', 'Loader', '$ionicHistory', '$filter',
            function ($scope, $state, $stateParams, $timeout, APIFactory, LSFactory, $rootScope, Loader, $ionicHistory, $filter) {
                $scope.participated = 'No';
                Loader.show();
                $scope.chart = [];
                $scope.options = {thickness: 10};
                APIFactory.pollDetails({'pid': $stateParams.id}).then(function (response) {
                    $scope.poll = response.data;
                    var participants = response.data.participants;
                    if (LSFactory.get('user')) {
                        var found = jQuery.grep(participants, function (element, index) {
                            return element.ID == LSFactory.get('user').ID;
                        });
                        if (found.length || (participants.indexOf(LSFactory.get('user').ID) > -1)) {
                            $scope.participated = 'Yes';
                        }
                    }

                    angular.forEach(response.data.options, function (value, key) {
                        value.number_of_votes = (value.number_of_votes == "" ? 0 : value.number_of_votes);
                        $scope.chart.push({'label': value.option, 'value': value.number_of_votes, 'color': $rootScope.colors[key]});
                    });
                    Loader.hide();
                    window.dispatchEvent(new Event('resize'));
                }, function (error) {
                    Loader.hide();
                    Loader.toast('Oops! something went wrong. Please try later again');
                });
                $scope.vote = function () {
                    if (!$rootScope.isLoggedIn) {
                        $rootScope.$broadcast('showLoginModal', $scope, function () {
                            $ionicHistory.goBack(-1);
                        }, function () {
                            vote();
                        });
                    } else {
                        vote();
                    }
                };

                function vote() {
                    var data = new FormData(jQuery("form.vote")[0]);
                    data.append('userId', LSFactory.get('user').ID);
                    Loader.show('Submitting Your Vote ...');
                    APIFactory.vote(data).then(function (response) {
                        if (response.data.error) {
                            Loader.toggleLoadingWithMessage(response.data.error, 2000);
                        } else {
                            Loader.toggleLoadingWithMessage(response.data.success, 2000);
                            jQuery("form.vote").hide();
                            angular.forEach(response.data, function (value, key) {
                                value.number_of_votes = (value.number_of_votes == "" ? 0 : value.number_of_votes);
                                $scope.chart.push({'label': value.option, 'value': value.number_of_votes, 'color': $rootScope.colors[key]});
                                $scope.$digest;
                                window.dispatchEvent(new Event('resize'));

                            });
                        }
                    });
                }

            }
        ])

        .controller('createPollCtrl', ['$scope', '$state', '$timeout', 'APIFactory', 'LSFactory', '$rootScope', 'Loader', '$ionicHistory',
            function ($scope, $state, $timeout, APIFactory, LSFactory, $rootScope, Loader, $ionicHistory) {

                Loader.show();
                APIFactory.getInterests().then(function (response) {
                    $scope.interests = response.data;
                    $scope.addOption();
                    $scope.addOption();
                    Loader.hide();
                }, function (error) {
                    Loader.hide();
                    Loader.toast('Oops! something went wrong. Please try later again');
                })

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

                $scope.addOption = function () {
                    jQuery(".options").append(jQuery(".toClone").html());
                    indexOptions();
                }

            }
        ])