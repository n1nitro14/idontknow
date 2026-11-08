var PrModule = angular.module('PrModule', ['ionic', 'ngCordova','pr-services'])

.config(function($stateProvider) {

  $stateProvider
  
  .state('pr', {
    url: '/pr',
    cache: false,
    templateUrl: 'pr/index.html',
    controller : 'PrCtl'
  })

  .state('pr-detail', {
    url: '/pr_detail',
    cache: false,
    templateUrl: 'pr/pr-detail.html',
    controller : 'PrDetailCtl'
  })

});