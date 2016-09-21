// Ionic askaudience App
var domain = 'http://ask-audience.cruxservers.in/api/?method=';
angular.module('askaudience', ['ionic', 'n3-pie-chart', 'ngCordova', 'askaudience.controllers', 'askaudience.services', 'askaudience.directives',  'ion-datetime-picker', 'gm', 'ngTagsInput'])

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
                $cordovaStatusbar.styleHex('#FF9800');

                } catch (e) {
                    console.log('real device only')
                }

            });
        })
        .config(function ($stateProvider, $urlRouterProvider, $sceDelegateProvider, $ionicConfigProvider) {
            $ionicConfigProvider.tabs.position('bottom');
            $ionicConfigProvider.views.maxCache(0);
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
                    .state('app.polls1', {
                        url: '/polls1',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/polls1.html',
                                controller: 'pollsCtrl1'
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
                    .state('app.createpoll1', {
                        url: '/create-poll1',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/createpoll1.html',
                                controller: 'createPollCtrl1'
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