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
      templateUrl: 'app/views/docs/middleware-and-authorization.html',
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
    //
    .when('/docs/running-in-production', {
      templateUrl: 'app/views/docs/running-in-production.html',
      controller: 'docsController'
    })
    
    .when('/docs/api-socketcluster', {
      templateUrl: 'app/views/docs/api-socketcluster.html',
      controller: 'docsController'
    })
    
    .when('/docs/api-global', {
      templateUrl: 'app/views/docs/api-global.html',
      controller: 'docsController'
    })
    
    .when('/docs/api-scchannel', {
      templateUrl: 'app/views/docs/api-scchannel.html',
      controller: 'docsController'
    })
    
    .when('/docs/api-scserver', {
      templateUrl: 'app/views/docs/api-scserver.html',
      controller: 'docsController'
    })
    
    .when('/docs/api-scsocket-client', {
      templateUrl: 'app/views/docs/api-scsocket-client.html',
      controller: 'docsController'
    })
    
    .when('/docs/api-scsocket-server', {
      templateUrl: 'app/views/docs/api-scsocket-server.html',
      controller: 'docsController'
    })
    
    .when('/docs/api-scworker', {
      templateUrl: 'app/views/docs/api-scworker.html',
      controller: 'docsController'
    })
    
    .when('/docs/api-session', {
      templateUrl: 'app/views/docs/api-session.html',
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