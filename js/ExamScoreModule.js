var ExamScoreModule = angular.module('ExamScoreModule', ['ionic', 'ngCordova'])

.config(function($stateProvider) {

  $stateProvider.state('nisit_score', {
    cache: false,
    url: '/nisit/score',
    templateUrl: 'nisit/exam_score.html',
    controller : 'ExamScoreCtl'
  });

});
