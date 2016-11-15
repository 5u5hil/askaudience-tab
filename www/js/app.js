// Ionic askaudience App
var domain = 'http://www.askaudience.com/api/?method=';
//var domain = 'http://ask-audience.cruxservers.in/api/?method=';
angular.module('askaudience', ['ionic', 'ngCordova', 'askaudience.controllers', 'askaudience.services', 'askaudience.directives', 'ion-datetime-picker', 'ngTagsInput', 'ion-autocomplete'])

        .run(function ($ionicPlatform, $cordovaStatusbar) {
            $ionicPlatform.ready(function () {
                setTimeout(function () {
                    try {
                        navigator.splashscreen.hide();
                    } catch (e) {
                    }
                }, 4000);
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
                }

            });
        })
        .config(function ($stateProvider, $urlRouterProvider, $sceDelegateProvider, $ionicConfigProvider) {
            $ionicConfigProvider.tabs.position('bottom');
            $ionicConfigProvider.navBar.alignTitle('left');
            $ionicConfigProvider.backButton.text('');
            $ionicConfigProvider.views.maxCache(0);
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
                    .state('app.my-profile', {
                        url: '/my-profile/:id/:reveal',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/my-profile.html',
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

function downscaleImage(dataUrl, newWidth) {
    "use strict";
    var image, oldWidth, oldHeight, newHeight, canvas, ctx, newDataUrl, imageType, imageArguments;

    // Provide default values
    imageType = "image/jpeg";
    imageArguments = 0.9;

    // Create a temporary image so that we can compute the height of the downscaled image.
    image = new Image();
    image.src = dataUrl;
    oldWidth = image.width;
    oldHeight = image.height;
    newHeight = Math.floor(oldHeight / oldWidth * newWidth)

    // Create a temporary canvas to draw the downscaled image on.
    canvas = document.createElement("canvas");
    canvas.width = newWidth;
    canvas.height = newHeight;
    var ctx = canvas.getContext("2d");

    // Draw the downscaled image on the canvas and return the new data URL.
    ctx.drawImage(image, 0, 0, newWidth, newHeight);
    newDataUrl = canvas.toDataURL(imageType, imageArguments);
    return newDataUrl;
}

var loadFile = function (event) {
    console.log(event.target.name);
    var reader = new FileReader();
    reader.onload = function () {
        var output = document.getElementById('output');
        var newurl = downscaleImage(reader.result, 500);
        jQuery("[type='hidden'][name='" + event.target.name + "']").val(newurl);

    };
    reader.readAsDataURL(event.target.files[0]);
};