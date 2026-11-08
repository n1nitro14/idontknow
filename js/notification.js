var host_notification = "https://kuappstore.ku.ac.th/message/";

NotificationModule.controller('NotificationPageController', function($scope, $rootScope,$state, NotificationServices,$cordovaDialogs,$ionicListDelegate) {

  $scope.amptime = new Date().getTime();
  $rootScope.$on('myCustomEvent', function (event, data) {
    $scope.Notifications = data.Notifications;
    $scope.Badge = data.Badge;
  });

  $scope.getNotifications = function() {
    if(window.localStorage.getItem('Notification')==null||(typeof window.localStorage.getItem('Notification') === 'undefined')){
      $scope.Notifications = [];
    }else{
      $scope.Notifications = JSON.parse(window.localStorage.getItem('Notification'));
    }
    NotificationServices.set($scope.Notifications);
  };

  $scope.onItemDelete = function(item) {
    $cordovaDialogs.confirm('ต้องการลบข้อความ', 'NisitKU', ['OK','Cancel'])
    .then(function(buttonIndex) {
      if(buttonIndex==1) {
        // console.log('You are sure');
        $scope.Notifications.splice($scope.Notifications.indexOf(item), 1);
        NotificationServices.set($scope.Notifications);
        $rootScope.$broadcast('myCustomEvent', {
          Notifications: $scope.Notifications,
          Badge:  NotificationServices.badge()
        });
      } else {
        $ionicListDelegate.closeOptionButtons();
      }
    });
  };

  $scope.deleteAll = function(noti) {
    $cordovaDialogs.confirm('ต้องการลบข้อความ Notification ทั้งหมด', 'NisitKU', ['OK','Cancel'])
    .then(function(buttonIndex) {
      if(buttonIndex==1) {
        window.localStorage.removeItem('Notification');
        $scope.getNotifications();
        $rootScope.$broadcast('myCustomEvent', {
          Notifications: $scope.Notifications,
          Badge:  NotificationServices.badge()
        });
      }
    })
  };

  $scope.readAll = function(noti) {
    $cordovaDialogs.confirm('ต้องการทำเครื่องหมายว่า อ่านแล้ว ทั้งหมด', 'NisitKU', ['OK','Cancel'])
    .then(function(buttonIndex) {
      if(buttonIndex==1) {
        noti.forEach((element,idx) => {
          $scope.onItemRead(idx);
        })
      }
    })
  };

  $scope.onItemRead = function(idx) {
    NotificationServices.read(idx);
    $scope.Notifications = NotificationServices.get();
    $rootScope.$broadcast('myCustomEvent', {
      Notifications: $scope.Notifications,
      Badge:  NotificationServices.badge()
    });
  };

  $scope.changeSetting = function(){
    $scope.goToState('setting');
  };

  $scope.goToNotiDetail = function(notiDetail){
    NotificationServices.setDetail(notiDetail);
    $state.go('notification-detail');
  };

})

.controller('NotificationDetailCtrl', function($scope, NotificationServices) {
  $scope.notiDetail = NotificationServices.getDetail();
})

.controller('SettingPageController', function($scope, $http) {
  var id = window.localStorage.getItem("id");
  var token = window.localStorage.getItem("token");
  var currentToken = window.localStorage.getItem("currentToken");

  $scope.settingsList = [];

  $scope.initSettings = function(){
    $http.post(host_notification+'notification.php',{
      "action" : "option",
      "app" : "NisitKU",
      "id": id,
      "token": token,
      "device_id" : currentToken
    })
    .success(function (response) {
        if (response.status == "true") {
          $scope.settingsList = response.data;
        }
    })
    .error(function (error) {
        console.log("Error Setting List." ,error)
    });
  }

  $scope.changeSettings = function(item) {
    $http.post(host_notification+'notification.php',{
      "action" : "setting",
      "app" : "NisitKU",
      "id": id,
      "token": token,
      "device_id" : currentToken,
      "option" : JSON.stringify(item)
    })
    .success(function (response) {
        // console.log(response);
    })
    .error(function (error) {
        console.log("Error Setting List." ,error)
    });
  };

})
