// TODO: Add 'ui.bootstrap' when tabs are needed
var socketclusterApp = angular.module('socketclusterApp', ['ngRoute', 'ui.bootstrap']);

socketclusterApp.config(function($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(false).hashPrefix('!');
  
  $routeProvider

    // Route for Home page
    
    .when('/', {
      templateUrl: 'app/views/index.html',
      controller: 'mainController'
    })

    .when('/demos', {
      templateUrl: 'app/views/demos.html',
      controller: 'demosController'
    })
    
    .when('/docs/getting-started', {
      templateUrl: 'app/views/docs/getting-started.html',
      controller: 'docsController'
    })

    .when('/docs/basic-usage', {
      templateUrl: 'app/views/docs/basic-usage.html',
      controller: 'docsController'
    })
    
    .when('/docs/debugging', {
      templateUrl: 'app/views/docs/debugging.html',
      controller: 'docsController'
    })
    
    .when('/performance', {
      templateUrl: 'app/views/performance.html',
      controller: 'performanceController'
    })
    .when('/docs/introduction', {
      templateUrl: 'app/views/docs/introduction.html',
      controller: 'docsController'
    })
    
    .when('/docs/authentication', {
      templateUrl: 'app/views/docs/authentication.html',
      controller: 'docsController'
    })

    .when('/docs/middleware-and-authorization', {
      templateUrl: 'app/views/docs/middleware-and-authorization.html',
      controller: 'docsController'
    })

    .when('/docs/handling-failure', {
      templateUrl: 'app/views/docs/handling-failure.html',
      controller: 'docsController'
    })

    .when('/docs/full-stack', {
      templateUrl: 'app/views/docs/full-stack.html',
      controller: 'docsController'
    })

    .when('/docs/running-in-production', {
      templateUrl: 'app/views/docs/running-in-production.html',
      controller: 'docsController'
    })

    .when('/docs/scaling-horizontally', {
      templateUrl: 'app/views/docs/scaling-horizontally.html',
      controller: 'docsController'
    })
    
    .when('/docs/api-socketcluster', {
      templateUrl: 'app/views/docs/api-socketcluster.html',
      controller: 'docsController'
    })
    
    .when('/docs/api-socketcluster-client', {
      templateUrl: 'app/views/docs/api-socketcluster-client.html',
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
    
    .when('/docs/api-channel', {
      templateUrl: 'app/views/docs/api-channel.html',
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
    
    .when('/docs/api-store', {
      templateUrl: 'app/views/docs/api-store.html',
      controller: 'docsController'
    })
    
    .when('/docs/api-session', {
      templateUrl: 'app/views/docs/api-session.html',
      controller: 'docsController'
    })
    
    .when('/docs', {
      templateUrl: 'app/views/docs/introduction.html',
      controller: 'docsController'
    });
});

socketclusterApp.directive('feelDemo', function() {
  return {
    templateUrl: 'app/shared/feel-demo.html',
    link: function ($scope) {
    
      var socket = socketCluster.connect({
        autoReconnectOptions: {
          initialDelay: 1000,
          randomness: 1000,
          maxDelay: 4000
        }
      });
      $scope.socket = socket;
      
      socket.on('status', function (status) {
        $scope.$apply(function () {
          $scope.hasWebSocketSupport = true;
        });
      });
      
      var watchChannel = function (channel) {
        channel.watch(function (data) {
          $scope.$apply(function () {
            channel.data = data;
          });
        });
        channel.on('subscribe', function () {
          if (!$scope.$$phase) $scope.$apply();
        });
        channel.on('unsubscribe', function () {
          if (!$scope.$$phase) $scope.$apply();
        });
      };
      
      $scope.addChannel = function () {
        var newChannelName = $scope.newChannelName;
        if (newChannelName == null || newChannelName.length <= 0) {
          $scope.addChannelError = 'Error - No channel name was specified';
        } else if (socket.isSubscribed(newChannelName)) {
          $scope.addChannelError = 'Error - Already subscribed to ' + newChannelName + ' channel';
        } else {
          $scope.addChannelError = '';
          var newChannel = socket.subscribe(newChannelName);
          $scope.newChannelName = '';
          $scope.channels.push(newChannel);
          $scope.publishChannelName = newChannelName;
          watchChannel(newChannel);
        }
      };
      
      $scope.publishToChannel = function () {
        socket.publish($scope.publishChannelName, $scope.publishChannelData);
        $scope.publishChannelData = '';
      };
      
      // This is necessary in case of unexpected connection failure (ping timeout)
      socket.on('disconnect', function () {
        if (!$scope.$$phase) $scope.$apply();
      });
      
      var randChannel = socket.subscribe('rand');
      var fooChannel = socket.subscribe('foo');
      $scope.channels = [randChannel, fooChannel];
      $scope.publishChannelName = 'foo';
      watchChannel(randChannel);
      watchChannel(fooChannel);
    }
  };
});

var trackAnalyticsPageView = function () {
  if (window.ga) {
    var pageName = location.hash.replace(/^#!/, '');
    ga('send', 'pageview', pageName);
  }
};

socketclusterApp.controller('mainController', function($scope) {
  $scope.ctrl = 'mainController';
  trackAnalyticsPageView();
});

socketclusterApp.controller('demosController', function($scope) {
  trackAnalyticsPageView();
});

socketclusterApp.controller('gsController', function($scope) {
  trackAnalyticsPageView();
});

socketclusterApp.controller('bsController', function($scope) {
  trackAnalyticsPageView();
});

socketclusterApp.controller('middlewareController', function($scope) {
  trackAnalyticsPageView();
});

socketclusterApp.controller('performanceController', function($scope) {
  trackAnalyticsPageView();
});

socketclusterApp.controller('docsController', function($scope) {
  trackAnalyticsPageView();
});

socketclusterApp.directive('prettyprint', function() {
  return {
    restrict: 'C',  
    link: function postLink(scope, element, attrs) {
      prettyPrint();
    }
  }
});