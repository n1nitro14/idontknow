var NotificationModule = angular.module('NotificationModule', ['ionic', 'ngCordova','notification-service'])
.config(function($stateProvider) {
  $stateProvider
  .state('notification', {
    url: '/notification',
    cache: false,
    templateUrl: 'notification/notification.html',
    controller : 'NotificationPageController'
  })

  .state('notification-detail', {
    url: '/notification_detail',
    cache: false,
    templateUrl: 'notification/notification-detail.html',
    controller : 'NotificationDetailCtrl'
  })

  .state('setting', {
    url: '/setting',
    templateUrl: 'notification/setting.html',
    controller : 'SettingPageController'
  })

});
