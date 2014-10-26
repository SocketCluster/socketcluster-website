var socketclusterApp = angular.module('socketclusterApp', ['ngRoute']);

socketclusterApp.config(function($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(false).hashPrefix('!');
  $routeProvider

    // Route for Home page
    .when('/', {
      templateUrl: 'app/views/index.html',
      controller: 'mainController'
    })

    // Route for Demos
    .when('/demos', {
      templateUrl: 'app/views/demos.html',
      controller: 'demosController'
    })
    
    // Route for Getting Started
    .when('/docs/getting-started', {
      templateUrl: 'app/views/docs/getting-started.html',
      controller: 'docsController'
    })
    // Route for Basic Setup
    .when('/docs/basic-usage', {
      templateUrl: 'app/views/docs/basic-usage.html',
      controller: 'docsController'
    })
    // Route for Performance
    .when('/performance', {
      templateUrl: 'app/views/performance.html',
      controller: 'performanceController'
    })
    .when('/docs/introduction', {
      templateUrl: 'app/views/docs/introduction.html',
      controller: 'docsController'
    })
    //
    .when('/docs/middleware-and-authorization', {
      templateUrl: 'app/views/docs/middleware.html',
      controller: 'docsController'
    })
    //
    .when('/docs/handling-failure', {
      templateUrl: 'app/views/docs/handling-failure.html',
      controller: 'docsController'
    })
    //
    .when('/docs/full-stack', {
      templateUrl: 'app/views/docs/full-stack.html',
      controller: 'docsController'
    })
    // Route for Docs
    .when('/docs', {
      templateUrl: 'app/views/docs/introduction.html',
      controller: 'docsController'
    });
});

socketclusterApp.controller('mainController', function($scope) {
  $scope.ctrl = 'mainController';
});

socketclusterApp.controller('demosController', function($scope) {

});

socketclusterApp.controller('gsController', function($scope) {

});

socketclusterApp.controller('bsController', function($scope) {

});

socketclusterApp.controller('middlewareController', function($scope) {

});

socketclusterApp.controller('performanceController', function($scope) {

});

socketclusterApp.controller('docsController', function($scope) {

});

socketclusterApp.directive('prettyprint', function() {
  return {
    restrict: 'C',  
    link: function postLink(scope, element, attrs) {
      prettyPrint();
    }
  }
});