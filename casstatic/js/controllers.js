/* Angular contollers for 
 * starshard - v4.0.6 
 */
function FloatMsgCtrl ($scope) {
  $scope.show = false;
  $scope.style = 'warning';
  $scope.$on('alertEvent', function (e, opt) {
    for (var prop in opt)
      $scope[prop] = opt[prop];
  });
}
FloatMsgCtrl.$inject = ['$scope'];

function NavCtrl($scope, $route, $http) {
  $scope.navActive = true;
  $scope.$route = $route;
  $scope.nav = {};
}
NavCtrl.$inject = ['$scope', '$route', '$http'];

function ProgressCtrl($scope, ngProgress) {
  ngProgress.color('#00c2ff');
  $scope.$on('$routeChangeStart', function (e) {
    ngProgress.reset();
    ngProgress.start();
  });
  $scope.$on('$routeChangeSuccess', function (e) {
    ngProgress.complete();
  });
  $scope.$on('$routeChangeError', function (e) {
    ngProgress.reset();
  });
}
ProgressCtrl.$inject = ['$scope', 'ngProgress'];

function LoginCtrl($scope, $http, $alertService, $window) {
  $scope.form = {};
  $scope.submit = function () {
    $http({
      method: 'POST',
      url: '/login',
      data: $scope.form
    })
    .success(function (data, status) {
      if (data.token) {
        var href = $window.location.href;
        $window.location.href = 'https://app.isitest.org:1443/cascallback?settoken=' + data.token;
      }
    })
    .error(function (data, status) {
      $alertService.send('An error has ocurred. Please try again later.');
      if (data.err) console.log(data.err);
    });
  }
}
LoginCtrl.$inject = ['$scope', '$http', '$alertService', '$window'];

function RegisterCtrl ($scope, $http, $alertService, $window) {
  $scope.signup = function () {
    $http({
      method: 'POST',
      url: '/register',
      data: $scope.form
    })
    .success(function (data, status) {
      $window.location.href = '#/';
    })
    .error(function (data, status) {
      $alertService.send('An error has ocurred. Please try again later.');
      if (data.err) console.log(data.err);
    });
  };
}
RegisterCtrl.$inject = ['$scope', '$http', '$alertService', '$window'];