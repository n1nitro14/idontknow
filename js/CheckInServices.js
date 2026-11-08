angular.module('checkin-services', [])

.factory('CheckInServices', function() {
  var items = new Object();
  var checkinDetail;
  return {
    get: function() {
		  return items;
    },
    remove: function() {
		  items = new Object();
    },
    set: function(item){
      items = item;
    },
    getCheckInDetail: function() {
		  return checkinDetail;
    },
    setCheckInDetail: function(item){
      checkinDetail = item;
    }
  };

});