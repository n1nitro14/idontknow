var VoteModule = angular.module('VoteModule', ['ionic', 'ngCordova','vote-services'])

.config(function($stateProvider) {

  $stateProvider
  
  .state('nisit_vote', {
    cache: false,
    url: '/nisit/vote',
    templateUrl: 'nisit/vote.html',
    controller : 'VoteCtl'
  })

  .state('nisit_vote-detail', {
    url: '/nisit/vote_detail',
    cache: false,
    templateUrl: 'nisit/vote-detail.html',
    controller : 'VoteDetailCtl'
  })

  .state('nisit_vote-detail-log', {
    url: '/nisit/vote_detail-log',
    cache: false,
    templateUrl: 'nisit/vote-detail-log.html',
    controller : 'VoteDetailCtl2'
  })

  .state('nisit_choice-detail', {
    url: '/nisit/choice_detail',
    cache: false,
    templateUrl: 'nisit/vote-choice-detail.html',
    controller : 'ChoiceDetailCtl'
  })

});