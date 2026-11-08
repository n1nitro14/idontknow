angular.module('pr-services', [])

.factory('PrServices', function() {

      var prDetailX;
      return {

          get: function() {
              return prDetailX;
          },
          remove: function() {
            prDetailX = new Object();
          },
          set: function(prDetail) {
            prDetailX = prDetail;
          }
      };
});