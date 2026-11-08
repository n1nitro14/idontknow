angular.module('notification-service', [])

.factory('NotificationServices', function($rootScope) {
      // Might use a resource here that returns a JSON array
      // Some fake testing data

      var Notify;
      var notiDetail;
      return {

          get: function() {
            return Notify;
          },
          set: function(notification) {
            window.localStorage.setItem('Notification', JSON.stringify(notification));
            Notify = notification;
          },
          badge : function() {
            unread = 0;
            Notify.forEach(element => {
              if(element.read=="0"){
                unread++;
              }
            })
            return unread;
          },
          read : function(idx) {
            Notify[idx].read = "1";
            window.localStorage.setItem('Notification', JSON.stringify(Notify));
          },
          getDetail: function() {
            return notiDetail;
          },
          setDetail: function(newsDetail) {
            notiDetail = newsDetail;
          }
      };
});
