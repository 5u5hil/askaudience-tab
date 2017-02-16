angular.module('askaudience.services', [])
        .factory('APIFactory', ['$http', '$httpParamSerializer', function ($http, $httpParamSerializer, $templateCache) {
                var api = {
                    getUser: function (data) {
                        var req = {method: 'GET', url: domain + 'getUser&uid=' + data};
                        return $http(req);
                    },
                    vote: function (data) {
                        var req = {method: 'POST', url: domain + 'vote', headers: {'Content-Type': undefined}, data: data};
                        return $http(req);
                    },
                    pollDetails: function (data) {
                        var req = {method: 'POST', url: domain + 'pollDetails', headers: {'Content-Type': 'application/x-www-form-urlencoded'}, data: $httpParamSerializer(data)};
                        return $http(req);
                    },
                    closed_polldetails: function (data) {
 
                        var req = {method: 'POST', url: domain + 'pollDetailsClosed&pid='+data, headers: {'Content-Type': 'application/x-www-form-urlencoded'}, data: $httpParamSerializer(data)};
                        return $http(req);
                    },
                    follow: function (data) {
                        var req = {method: 'POST', url: domain + 'follow', headers: {'Content-Type': 'application/x-www-form-urlencoded'}, data: $httpParamSerializer(data)};
                        return $http(req);
                    },
                    unfollow: function (data) {
                        var req = {method: 'POST', url: domain + 'unfollow', headers: {'Content-Type': 'application/x-www-form-urlencoded'}, data: $httpParamSerializer(data)};
                        return $http(req);
                    },
                    friendRequestAccept: function (data) {
                        var req = {method: 'POST', url: domain + 'faccept', headers: {'Content-Type': 'application/x-www-form-urlencoded'}, data: $httpParamSerializer(data)};
                        return $http(req);
                    },
                    friendRequestReject: function (data) {
                        var req = {method: 'POST', url: domain + 'freject', headers: {'Content-Type': 'application/x-www-form-urlencoded'}, data: $httpParamSerializer(data)};
                        return $http(req);
                    },
                    friendRequestCancel: function (data) {
                        var req = {method: 'POST', url: domain + 'fCancelRequest', headers: {'Content-Type': 'application/x-www-form-urlencoded'}, data: $httpParamSerializer(data)};
                        return $http(req);
                    },
                    unFriend: function (data) {
                        var req = {method: 'POST', url: domain + 'unfriend', headers: {'Content-Type': 'application/x-www-form-urlencoded'}, data: $httpParamSerializer(data)};
                        return $http(req);
                    },
                    addFriend: function (data) {
                        var req = {method: 'POST', url: domain + 'frequest', headers: {'Content-Type': 'application/x-www-form-urlencoded'}, data: $httpParamSerializer(data)};
                        return $http(req);
                    },
                    getInterests: function () {
                        var req = {method: 'GET', url: domain + 'getInterests', headers: {'Content-Type': 'application/x-www-form-urlencoded'}};
                        return $http(req);
                    },
                    getPolls: function (filters, pageNo, orderBy, userId, groupPolls, cId) {
                        var req = {method: 'GET', url: domain + 'getPolls&' + filters + '&pageNo=' + pageNo + '&orderby=' + orderBy + '&userId=' + userId + '&type=' + groupPolls + '&cid=' + cId};
                        return $http(req);
                    },
                    getPollById: function (pollId) {
                        var req = {method: 'GET', url: domain + 'getPolls&search_by=2&sterm=' + pollId};
                        return $http(req);
                    },
                    getPollsGroup: function (filters, pageNo, orderBy, userId, groupPolls, gId, cId) {
                        var req = {method: 'GET', url: domain + 'getGroupPolls&' + filters + '&pageNo=' + pageNo + '&orderby=' + orderBy + '&userId=' + userId + '&type=' + groupPolls + '&gid=' + gId + '&cid=' + cId};
                        return $http(req);
                    },
                    getPollsByType: function (data) {
                        var req = {method: 'POST', url: domain + 'getPollsByTypes', headers: {'Content-Type': 'application/x-www-form-urlencoded'}, data: $httpParamSerializer(data)};
                        return $http(req);
                    },
                    forme: function (userId, pageNo) {
                        var req = {method: 'GET', url: domain + 'forme&userId=' + userId + '&pageNo=' + pageNo};
                        return $http(req);
                    },
                    getPollType: function (data) {
                        var req = {method: 'POST', url: domain + 'polltypes', headers: {'Content-Type': 'application/x-www-form-urlencoded'}, data: $httpParamSerializer(data)};
                        return $http(req);
                    },
                    getRepostedBy: function (data) {
                        var req = {method: 'POST', url: domain + 'getRepost', headers: {'Content-Type': 'application/x-www-form-urlencoded'}, data: $httpParamSerializer(data)};
                        return $http(req);
                    },
                    deletePoll: function (data) {
                        var req = {method: 'POST', url: domain + 'deletePost', headers: {'Content-Type': 'application/x-www-form-urlencoded'}, data: $httpParamSerializer(data)};
                        return $http(req);
                    },
                    searchUser: function (data) {
                        var req = {method: 'POST', url: domain + 'searchUser', headers: {'Content-Type': 'application/x-www-form-urlencoded'}, data: $httpParamSerializer(data)};
                        return $http(req);
                    },
                    updateUserProfile: function (data) {
                        var req = {method: 'POST', url: domain + 'updateUserProfile', headers: {'Content-Type': undefined}, cache: $templateCache, data: data};
                        return $http(req);
                    },
                    updateUserPassword: function (uId, password) {
                        console.log(uId);
                        console.log(password);
                        var req = {method: 'POST', url: domain + 'updateUserPassword', headers: {'Content-Type': 'application/x-www-form-urlencoded'}, cache: $templateCache, data: jQuery.param({'uId': uId, 'password': password})};
                        return $http(req);
                    },
                    authUser: function (data) {
                        data.playerId = playerId;
                        var req = {method: 'POST', url: domain + 'login', headers: {'Content-Type': 'application/x-www-form-urlencoded'}, data: $httpParamSerializer(data)};
                        return $http(req);
                    },
                    likePoll: function (data) {
                        var req = {method: 'POST', url: domain + 'like', headers: {'Content-Type': 'application/x-www-form-urlencoded'}, data: $httpParamSerializer(data)};
                        return $http(req);
                    },
                    unlikePoll: function (data) {
                        var req = {method: 'POST', url: domain + 'unlike', headers: {'Content-Type': 'application/x-www-form-urlencoded'}, data: $httpParamSerializer(data)};
                        return $http(req);
                    },
                    notifyMe: function (data) {
                        var req = {method: 'POST', url: domain + 'notify', headers: {'Content-Type': 'application/x-www-form-urlencoded'}, data: $httpParamSerializer(data)};
                        return $http(req);
                    },
                    unNotifyMe: function (data) {
                        var req = {method: 'POST', url: domain + 'unnotify', headers: {'Content-Type': 'application/x-www-form-urlencoded'}, data: $httpParamSerializer(data)};
                        return $http(req);
                    },
                    repost: function (data) {
                        var req = {method: 'POST', url: domain + 'repost', headers: {'Content-Type': 'application/x-www-form-urlencoded'}, data: $httpParamSerializer(data)};
                        return $http(req);
                    },
                    flag: function (data) {
                        var req = {method: 'POST', url: domain + 'flag', headers: {'Content-Type': 'application/x-www-form-urlencoded'}, data: $httpParamSerializer(data)};
                        return $http(req);
                    },
                    registerUser: function (data) {
                        var req = {method: 'POST', url: domain + 'manualRegistration', headers: {'Content-Type': undefined}, data: data};
                        return $http(req);
                    },
                    createPoll: function (data) {
                        var req = {method: 'POST', url: domain + 'createPoll', headers: {'Content-Type': undefined}, data: data};
                        return $http(req);
                    },
                    linkedInLogin: function (access_token) {
                        return $http.get('https://api.linkedin.com/v1/people/~:(id,email-address,first-name,last-name,picture-url)?format=json&oauth2_access_token=' + access_token);
                    },
                    resetPwd: function (data) {
                        var req = {method: 'POST', url: domain + 'forgotPassword', headers: {'Content-Type': 'application/x-www-form-urlencoded'}, data: $httpParamSerializer(data)};
                        return $http(req);
                    },
                    socialRegister: function (data) {
                        var req = {method: 'POST', url: domain + 'socialRegistration', headers: {'Content-Type': 'application/x-www-form-urlencoded'}, data: $httpParamSerializer(data)};
                        return $http(req);
                    },
                    updateUser: function (data, password, userId) {
                        return $http.post(domain + "update-user&first_name=" + data.user_meta.first_name[0] + "&last_name=" + data.user_meta.last_name[0] + "&phone=" + data.user_meta.phone[0] + "&email=" + data.user_email + "&address=" + data.user_meta.address[0] + "&city=" + data.user_meta.city[0] + "&postalcode=" + data.user_meta.postal_code[0] + "&state=" + data.user_meta.state[0] + "&country=" + data.user_meta.country[0] + "&pass=" + password.pass + "&repass=" + password.repass + "&userId=" + userId);
                    },
                    sendContactMail: function (data) {
                        var req = {method: 'POST', url: domain + 'contactUs', headers: {'Content-Type': 'application/x-www-form-urlencoded'}, cache: $templateCache, data: $httpParamSerializer(data)};
                        return $http(req);
                    },
                    linkedinToken: function (data) {
                        return $http({method: "post", headers: {'Content-Type': 'application/x-www-form-urlencoded'}, url: "https://www.linkedin.com/uas/oauth2/accessToken", data: $httpParamSerializer(data)})
                    },
                    getGroup: function (uid, getPage, checkPaginate) {
                        return $http({method: "post", headers: {'Content-Type': 'application/x-www-form-urlencoded'}, url: domain + "mygroup&uid=" + uid + "&pageNo=" + getPage + "&checkPaginate" + checkPaginate, data: {}})
                    },
                    createGroup: function (data) {
                        var req = {method: 'POST', url: domain + 'group', headers: {'Content-Type': undefined}, cache: undefined, data: data};
                        return $http(req);
                    },
                    getGroupById: function (uid) {
                        return $http({method: "post", headers: {'Content-Type': 'application/x-www-form-urlencoded'}, url: domain + "getGroupById&pid=" + uid, data: {}})
                    },
                    joinGroup: function (data) {
                        var req = {method: 'POST', url: domain + 'joinGroup', headers: {'Content-Type': undefined}, cache: undefined, data: data};
                        return $http(req);
                    },
                    memberAccept: function (data) {
                        var req = {method: 'POST', url: domain + 'acceptMembers', headers: {'Content-Type': undefined}, cache: undefined, data: data};
                        return $http(req);
                    },
                    rejectMembers: function (data) {
                        var req = {method: 'POST', url: domain + 'rejectMembers', headers: {'Content-Type': undefined}, cache: undefined, data: data};
                        return $http(req);
                    },
                    removeMembers: function (data) {
                        var req = {method: 'POST', url: domain + 'removeMembers', headers: {'Content-Type': undefined}, cache: undefined, data: data};
                        return $http(req);
                    },
                    updateMembers: function (data) {
                        var req = {method: 'POST', url: domain + 'updateMembers', headers: {'Content-Type': undefined}, cache: undefined, data: data};
                        return $http(req);
                    },
                    memberExit: function (data) {
                        var req = {method: 'POST', url: domain + 'memberExit', headers: {'Content-Type': undefined}, cache: undefined, data: data};
                        return $http(req);
                    },
                    deleteGroup: function (data) {
                        var req = {method: 'POST', url: domain + 'deleteGroup', headers: {'Content-Type': undefined}, cache: undefined, data: data};
                        return $http(req);
                    },
                    logout: function (uid) {
                        return $http({method: "post", headers: {'Content-Type': 'application/x-www-form-urlencoded'}, url: domain + "logout&uid=" + uid, data: {}})
                    }
                };
                return api;
            }])
        .factory('Loader', ['$ionicLoading', '$timeout', '$cordovaToast', function ($ionicLoading, $timeout, $cordovaToast) {
                var LOADERAPI = {
                    show: function (text) {
                        if (text) {
                            $ionicLoading.show({
                                template: text
                            });
                        } else {
                            $ionicLoading.show();
                        }
                    },
                    hide: function () {
                        $ionicLoading.hide();
                    },
                    toggleLoadingWithMessage: function (text, timeout) {
                        var self = this;
                        self.show(text);
                        $timeout(function () {
                            self.hide();
                        }, timeout || 3000);
                    },
                    toast: function (msg) {
                        var isAndroid = ionic.Platform.isAndroid();
                        var isIOS = ionic.Platform.isIOS();
                        if (isAndroid || isIOS) {
                            $cordovaToast.show(msg, 'short', 'center').then(function (success) {
                            });
                        } else {
                            console.info(msg);
                        }
                    }
                };
                return LOADERAPI;
            }])
        .factory('LSFactory', [function () {

                var LSAPI = {
                    clear: function () {
                        return localStorage.clear();
                    },
                    get: function (key) {
                        return JSON.parse(localStorage.getItem(key));
                    },
                    set: function (key, data) {
                        return localStorage.setItem(key, JSON.stringify(data));
                    },
                    setArray: function (key, data) {
                        return localStorage.setItem(key, JSON.stringify([data]));
                    },
                    delete: function (key) {
                        return localStorage.removeItem(key);
                    },
                    getAll: function () {
                    }
                };
                return LSAPI;
            }])
        .factory('CommonFactory', ['$cordovaInAppBrowser', function ($cordovaInAppBrowser) {

                var commonFactory = {
                    inAppLink: function (link) {
                        var options = {location: 'yes', clearcache: 'yes', toolbar: 'no', closebuttoncaption: 'DONE?'};
                        return $cordovaInAppBrowser.open(link, '_blank', options);
                    }
                }
                return commonFactory;
            }])