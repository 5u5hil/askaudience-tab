// Ionic askaudience App
var domain = 'http://www.askaudience.com/api/?method=';
var playerId = '';
//var domain = 'http://ask-audience.cruxservers.in/api/?method=';
angular.module('askaudience', ['ionic', 'ngCordova', 'askaudience.controllers', 'askaudience.services', 'askaudience.directives', 'ion-datetime-picker', 'ngTagsInput', 'ion-autocomplete'])



        .run(function ($ionicPlatform, $cordovaStatusbar, $state) {




            $ionicPlatform.ready(function () {
                // Enable to debug issues.
                // window.plugins.OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});


                // Sync hashed email if you have a login system or collect it.
                //   Will be used to reach the user at the most optimal time of day.
                // window.plugins.OneSignal.syncHashedEmail(userEmail);

                setTimeout(function () {
                    try {
                        navigator.splashscreen.hide();
                    } catch (e) {
                    }
                }, 4000);



                if (window.cordova && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                    cordova.plugins.Keyboard.disableScroll(true);


                    console.log('run');
                    var notificationOpenedCallback = function (jsonData) {
                        var url = jsonData.notification.payload.additionalData.url;
                        var userId = jsonData.notification.payload.additionalData.userId;
                        $state.go(url, {'id': userId});
                        console.log(jsonData.notification.payload.additionalData.url);
                        console.log('above data 3');
                        console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
                    };

                    // TODO: Update with your OneSignal AppId and googleProjectNumber before running.
                    window.plugins.OneSignal
                            .startInit("575bde50-33c9-469b-8fa3-7988fbac18f3", "1000785893673")
                            .handleNotificationOpened(notificationOpenedCallback)
                            .endInit();


                    window.plugins.OneSignal.getIds(function (ids) {
                        //document.getElementById("OneSignalUserID").innerHTML = "UserID: " + ids.userId;
                        //document.getElementById("OneSignalPushToken").innerHTML = "PushToken: " + ids.pushToken;
                        if (typeof (ids['userId']) !== 'undefined') {
                            playerId = ids['userId'];
                            console.log(JSON.stringify(ids['userId']));
                        }
                    });


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
                        url: '/user/:id/:reveal/:uid',
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
                    .state('app.group', {
                        url: '/group',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/group.html',
                                controller: 'grpCtrl'
                            }
                        }
                    })
                    .state('app.groupinfo', {
                        url: '/groupinfo/:gid',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/group-info.html',
                                controller: 'grpInfoCtrl'
                            }
                        }
                    })
                    .state('app.create-group', {
                        url: '/create-group/:id',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/create-group.html',
                                controller: 'createGrpCtrl'
                            }
                        }
                    })
                    .state('app.groupPollListing', {
                        url: '/poll-group/:cid',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/poll-group.html',
                                controller: 'groupPollListingCtrl'
                            }
                        }
                    })

            // if none of the above states are matched, use this as the fallback
            $urlRouterProvider.otherwise('/app/create-group/670');
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

var loadFile = function (e) {

    var file = e.target.files[0];


    // CANVAS RESIZING
    canvasResize(file, {
        width: 800,
        height: 0,
        crop: false,
        quality: 80,
        rotate: 0,
        callback: function (data, width, height) {


            $("#hidden").attr('value', data);
            $(this).append(data);


        }
    });

};