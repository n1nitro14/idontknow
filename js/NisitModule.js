var NisitModule = angular.module('NisitModule', ['ionic', 'ngCordova'])
.config(function($stateProvider) {
  $stateProvider
  .state('nisit', {
    cache: false,
    url: '/nisit',
    templateUrl: 'nisit/index.html',
    controller : 'NisitCtl'
  })
  .state('nisit_profile', {
    cache: false,
    url: '/nisit/profile',
    templateUrl: 'nisit/profile.html',
    controller : 'NisitCtl'
  })
  .state('nisit_card', {
    cache: false,
    url: '/nisit/card',
    templateUrl: 'nisit/card.html',
    controller : 'NisitCtl'
  })
  .state('nisit_grade', {
    cache: false,
    url: '/nisit/grade',
    templateUrl: 'nisit/grade.html',
    controller : 'NisitCtl'
  })
  .state('nisit_register', {
    cache: false,
    url: '/nisit/register',
    templateUrl: 'nisit/register.html',
    controller : 'NisitCtl'
  })
  .state('nisit_regisinfo', {
    cache: false,
    url: '/nisit/regisinfo',
    templateUrl: 'nisit/regisinfo.html',
    controller : 'NisitCtl'
  })
  .state('nisit_cs_time', {
    cache: false,
    url: '/nisit/cs_time',
    templateUrl: 'nisit/cs_time.html',
    controller : 'NisitCtl'
  })
  .state('nisit_exam_schedule', {
    cache: false,
    url: '/nisit/exam_schedule',
    templateUrl: 'nisit/exam_schedule.html',
    controller : 'NisitCtl'
  })
  .state('nisit_policy', {
    cache: false,
    url: '/nisit/policy',
    templateUrl: 'nisit/policy.html',
    controller : 'NisitCtl'
  })
  .state('nisit_term', {
    cache: false,
    url: '/nisit/term',
    templateUrl: 'nisit/term.html',
    controller : 'NisitCtl'
  })
  .state('nisit_ku9', {
    cache: false,
    url: '/nisit/ku9',
    templateUrl: 'nisit/ku9.html',
    controller : 'NisitCtl'
  })

  .state('nisit_activity', {
    cache: false,
    url: "/nisit_activity",
    abstract: true,
    templateUrl: "nisit/act-tabs.html",
    controller: function($scope, $state, $location){
        $scope.goToState = function(stateName){
          $state.go(stateName);
        }
      $scope.GoMain = function(){
        window.location.href='../index.html'
      }
    }
  })
  .state('nisit_activity.main', {
    cache: false,
    url: '/activity',
    views: {
      'tab-nisit': {
        templateUrl: 'nisit/act-nisit.html',
        controller: 'NisitCtl'
      }
    }
  })
  .state('nisit_activity.report', {
    cache: false,
    url: '/report',
    views: {
      'tab-report': {
        templateUrl: 'nisit/act-report-b3.html',
        controller: 'NisitCtl'
      }
    }
  })
  .state('nisit_activity.calendar', {
    cache: false,
    url: '/calendar',
    views: {
      'tab-calendar': {
        templateUrl: 'nisit/act-calendar.html',
        controller: 'NisitCtl'
      }
    }
  })
  .state('nisit_activity.calendar_detail', {
    cache: false,
    url: '/act-calendar/:campusid',
    views: {
      'tab-calendar': {
        templateUrl: 'nisit/act-calendar-detail.html',
        controller: 'NisitCtl'
      }
    }
  })
});
