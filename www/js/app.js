// Ionic askaudience App
var domain = 'http://ask-audience.cruxservers.in/api/?method=';
angular.module('askaudience', ['ionic', 'ngCordova', 'askaudience.controllers', 'askaudience.services', 'askaudience.directives', 'ion-datetime-picker', 'ngTagsInput', 'ion-autocomplete'])

        .run(function ($ionicPlatform, $cordovaStatusbar) {
            $ionicPlatform.ready(function () {
                setTimeout(function () {
                    try {
                        navigator.splashscreen.hide();
                    } catch (e) {
                    }
                }, 300);
                if (window.cordova && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                    cordova.plugins.Keyboard.disableScroll(true);
                }
                try {
                    if (window.StatusBar) {
                        StatusBar.styleDefault();
                    }
                    $cordovaStatusbar.styleHex('#ca9606');

                } catch (e) {
                    console.log('real device only')
                }

            });
        })
        .config(function ($stateProvider, $urlRouterProvider, $sceDelegateProvider, $ionicConfigProvider) {
            $ionicConfigProvider.tabs.position('bottom'); 
            // $ionicConfigProvider.backButton.text('');

            $sceDelegateProvider.resourceUrlWhitelist(['self', new RegExp('^(http[s]?):\/\/(w{3}.)?youtube\.com/.+$')]);

            $stateProvider
                    .state('app', {
                        url: '/app',
                        abstract: true,
                        templateUrl: 'templates/menu.html',
                        controller: 'AppCtrl'
                    })
                    .state('app.polls', {
                        url: '/polls',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/polls.html',
                                controller: 'pollsCtrl'
                            }
                        }
                    })

                    .state('app.forme', {
                        url: '/forme',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/forme.html',
                                controller: 'formeCtrl'
                            }
                        }
                    })

                    .state('app.friendrequests', {
                        url: '/frequests',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/frequests.html',
                                controller: 'frequestsCtrl'
                            }
                        }
                    })

                    .state('app.polldetails', {
                        url: '/polldetails/:id',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/polldetails.html',
                                controller: 'pollDetailsCtrl'
                            }
                        }
                    })
                    .state('app.createpoll', {
                        url: '/create-poll',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/createpoll.html',
                                controller: 'createPollCtrl'
                            }
                        }
                    })
                    .state('app.user', {
                        url: '/user/:id/:reveal',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/user-profile.html',
                                controller: 'userProfileCtrl'
                            }
                        }
                    })
                    .state('app.user-profile', {
                        url: '/user-profile',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/user-profile.html',
                                controller: 'userProfileCtrl'
                            }
                        }
                    })
                    .state('app.about', {
                        url: '/about',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/about.html'
                            }
                        }
                    })
                    .state('app.terms', {
                        url: '/terms',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/terms.html'
                            }
                        }
                    })

                    .state('app.contact', {
                        url: '/contact',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/contact.html',
                                controller: 'contactCtrl'
                            }
                        }
                    })


            // if none of the above states are matched, use this as the fallback
            $urlRouterProvider.otherwise('/app/polls');
        }) 