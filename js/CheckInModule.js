var CheckInModule = angular.module('CheckInModule', ['ionic', 'ngCordova','checkin-services'])

.config(function($stateProvider) {

  $stateProvider
  
  .state('nisit_checkin', {
    cache: false,
    url: '/nisit/checkin',
    templateUrl: 'nisit/checkin.html',
    controller : 'CheckInCtl'
  })

  .state('nisit_checkin-detail', {
    url: '/nisit/checkin_detail',
    cache: false,
    templateUrl: 'nisit/checkin-detail.html',
    controller : 'CheckInDetailCtrl'
  })

});
