var EventModule = angular.module('EventModule', ['ionic', 'ngCordova'])
.config(function($stateProvider) {
  $stateProvider
  .state('event', {
    url: '/event',
    templateUrl: 'event/index.html',
    controller : 'EventCtl'
  })

});
