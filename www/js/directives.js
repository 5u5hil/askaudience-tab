angular.module('askaudience.directives', [])
        .filter('capitalize', function () {
            return function (input) {
                return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
            }
        })
        .filter('html', function ($sce) {
            return function (input) {
                return $sce.trustAsHtml(input);
            }
        })
        .directive('validPasswordC', function () {
            return {
                require: 'ngModel',
                link: function (scope, elm, attrs, ctrl) {
                    ctrl.$parsers.unshift(function (viewValue, $scope) {
                        var noMatch = viewValue != scope.changePwdForm.password.$viewValue
                        ctrl.$setValidity('noMatch', !noMatch)
                    })
                }
            }
        });