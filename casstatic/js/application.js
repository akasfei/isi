/* jshint -W097 */
'use strict';

angular
  .module('isiapp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'ui.bootstrap',
    'ngProgress'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: '/views/login.html',
        controller: 'LoginCtrl',
        nav: 'login'
      })
      .when('/register', {
        templateUrl: '/views/register.html',
        controller: 'RegisterCtrl',
        nav: 'register'
      })
      .otherwise({
        templateUrl: '/views/404.html'
      });
    // TODO: get routes from server
    //
    //
  })
  .factory('$alertService', ['$rootScope', function ($rootScope) {
    return {
      show: function () {
        return $rootScope.$broadcast('alertEvent', {show: true});
      },
      hide: function () {
        return $rootScope.$broadcast('alertEvent', {show: false});
      },
      send: function (opt) {
        if (typeof opt === 'string')
          return $rootScope.$broadcast('alertEvent', {show: true, msg: opt});
        else {
          var e = {show: true, style: 'warning'};
          if (typeof opt.style !== undefined)
            e.style = opt.style;
          if (typeof opt.msg === 'undefined')
            return;
          e.msg = opt.msg;
          return $rootScope.$broadcast('alertEvent', e);
        }
      }
    };
  }]);
