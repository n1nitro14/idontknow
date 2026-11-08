var KuLibraryModule = angular.module('KuLibraryModule', ['ionic', 'ngCordova'])

.config(function($stateProvider) {

  $stateProvider.state('nisit_lib', {
    cache: false,
    url: '/nisit/lib',
    templateUrl: 'nisit/library.html',
    controller : 'KuLibraryCtl'
  });

});
