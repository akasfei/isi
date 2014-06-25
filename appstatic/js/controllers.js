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

function HomeCtrl ($scope, $http) {

}
HomeCtrl.$inject = ['$scope', '$http'];

function ListCtrl ($scope, $http) {
  $scope.docs = [];
  $http({
    method: 'GET',
    url: '/docs'
  })
  .success(function (data, status) {
    if (data.docs)
      $scope.docs = data.docs;
  })
  .error(function (data, status) {
    $alertService.send('An error has ocurred. Please try again later.');
    if (data.err) console.log(data.err);
  });
}
ListCtrl.$inject = ['$scope', '$http'];

function ContentCtrl ($scope, $route, $http) {
  $scope.$route = $route;
  $http({
    method: 'GET',
    url: '/docs/' + $route.current.params.title
  })
  .success(function (data, status) {
    if (data.doc)
      $scope.content = data.doc.content;
  })
  .error(function (data, status) {
    $alertService.send('An error has ocurred. Please try again later.');
    if (data.err) console.log(data.err);
  });
}
ContentCtrl.$inject = ['$scope', '$route', '$http'];

function NewCtrl ($scope, $http, $window) {
  $scope.form = {};
  $scope.users = [];
  $http({
    method: 'GET',
    url: '/users'
  })
  .success(function (data, status) {
    if (data.users)
      $scope.users = data.users;
  })
  .error(function (data, status) {
    $alertService.send('An error has ocurred. Please try again later.');
    if (data.err) console.log(data.err);
  });
  $scope.submit = function () {
    $http({
      method: 'PUT',
      url: '/docs/' + $scope.form.title,
      data: {content: $scope.form.content}
    })
    .success(function (data, status) {
      $window.location.href = '#/docs/' + $scope.form.title;
    })
    .error(function (data, status) {
      $alertService.send('An error has ocurred. Please try again later.');
      if (data.err) console.log(data.err);
    });
  }
}
NewCtrl.$inject = ['$scope', '$http', '$window'];

function LogsCtrl ($scope, $http) {
  $scope.query = {};
  $scope.get = function () {
    $http({
      method: 'GET',
      url: '/logs',
      params: $scope.query
    })
    .success(function (data, status) {
      if (data.logs)
        $scope.logs = data.logs;
    })
    .error(function (data, status) {
      $alertService.send('An error has ocurred. Please try again later.');
      if (data.err) console.log(data.err);
    });
  }
  $scope.get();
}
ListCtrl.$inject = ['$scope', '$http'];