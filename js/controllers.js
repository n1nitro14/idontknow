var host = 'https://kuappstore.ku.ac.th/nisitku/';
var host1 = 'https://kuappstore.ku.ac.th/insideku/';
var hostlib = 'https://kuappstore.ku.ac.th/kulib/';
var hostmessage = 'https://kuappstore.ku.ac.th/message/';
var act_notfound = 0;
var act_info = "";
var act_url = "";

angular.module('starter.controllers', ['ionic','notification-service','pr-services'])

  .config(['ngToastProvider', function(ngToast) {
    ngToast.configure({
      animation: 'slide',
      horizontalPosition: 'center',
      combineDuplications: true,
      additionalClasses: 'my-toast'
    });
  }])

  .controller('AppCtrl', function ($rootScope, $scope, $ionicPlatform, $ionicModal, $cordovaDevice, $http, $state, $sce, $ionicPopover,
    $ionicActionSheet, $cordovaDialogs, NotificationServices, $ionicHistory,ngToast, $ionicSlideBoxDelegate,PrServices) {

    $scope.HotnewsLists = [];
    $scope.getHotnews = function() {
      var id = window.localStorage.getItem("id");
      var token = window.localStorage.getItem("token");
      $http
        .post('https://kuappstore.ku.ac.th/hotnews/api.php', {
          'action': 'hotnews',
          'app': 'NisitKU',
          'id':id,
          'token': token
        })
        .success(function(response) {
          if (response.status == "true") {
            $scope.HotnewsLists = response.data;
            setTimeout( function(){
              $ionicSlideBoxDelegate.$getByHandle('sliderBanNisit').update();
            },1000);
          }
      })
      .error(function(error) {
        $scope.item = '{"status" : false , "msg_desc" : "' + error + '"}';
      });
    };

    $scope.slideNisitHasChanged = function (index) {
      $scope.slideIndex = index;
      if (($ionicSlideBoxDelegate.$getByHandle('sliderBanNisit').count() - 1) == index) {
        setTimeout(function () {
          $ionicSlideBoxDelegate.$getByHandle('sliderBanNisit').slide(0);
        }, 1000);
      }
    };

    $scope.dismissToast = function() {
      ngToast.dismiss();
    };

    $scope.OpenToast = function(notification){
      console.log('OpenToast');
      var amptime = new Date().getTime();

      var app_icon = "https://kuappstore.ku.ac.th/message/icon/nisitku.png";

      var data = {
        title: notification.title,
        message: notification.message,
        image: notification.image
      }
      data = Object.assign(data, notification.additionalData);

      ngToast.create({
        className: 'light',
        content: $sce.trustAsHtml('<div ng-click="dismissToast();goToState(\'notification\');">'+
        '<div class="item item-avatar item-text-wrap">'+
        '<img style="width:30px;height: 30px;" ng-src="'+data.noticon+'?v='+amptime+'">'+
        // '<img style="width:30px;height: 30px;" ng-src="'+app_icon+'?v='+amptime+'">'+
        '<h4>'+data.title+'</h4>'+
        '<p>'+data.message+'</p>'+
        // '<p style="font-size:12px;">'+data.post_by+'</p>'+
        '</div>'+
        '</div>'),
        compileContent: true,
        dismissButton: true,
        dismissButtonHtml: '&times;',
        dismissOnTimeout: false,
        dismissOnClick: false,
      });

    }

    document.addEventListener("resume", onResume, false);
    function onResume() {
      var id = window.localStorage.getItem("id");
      if (id != null) {
        $scope.loadNotification();
      }
    }

    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
      window.open = cordova.InAppBrowser.open;
      var id = window.localStorage.getItem("id");
      if (id != null) {
        $scope.loadNotification();
      }
    }

    // Push Notification
    $ionicPlatform.ready(function () {
      checkPushPermissions();
    });

    function checkPushPermissions() {
      var diagnostic = cordova.plugins.diagnostic;

      if (ionic.Platform.isAndroid()) {
        //Android
        PushNotification.hasPermission(data => {
          if(data.isEnabled) {
            console.log('Notification permission granted.');
            initPushNotification();
          }else{
            console.log('Unable to get permission to notify.');
            // Get permissions for Android v13 (SDK v33) and above
            if (parseInt(device.version) >= 13) {
              console.log('Get permissions for Android v13 (SDK v33) and above');
              diagnostic.requestRuntimePermission(function(status){
                if(status === diagnostic.permissionStatus.GRANTED){
                  initPushNotification();
                }
              }, console.error, diagnostic.permission.POST_NOTIFICATIONS);

            }
          }
        });
      } else {
        //iOS
        initPushNotification();
      }
    }

    function initPushNotification(){
      var pushOptions = {
        android: {
          sound: "true",
          vibrate: "true",
          forceShow: "true"
        },
        ios: {
          alert: "true",
          badge: "true",
          sound: "true"
        }
      };

      var push = PushNotification.init(pushOptions);
      push.on('registration', function (data) {
        console.log("registration event");

        if (data.registrationId) {
          $scope.$apply(function () {
            $scope.regId = data.registrationId;
          })
          // console.log(JSON.stringify(data));

          window.localStorage.setItem('currentToken', data.registrationId);

          // กรณี นิสิต login แล้ว และยังไม่ได้ sendToken
          var id = window.localStorage.getItem("id");
          var token = window.localStorage.getItem("token");
          if (id != null) {
            sendTokenToServer(id, token, data.registrationId);
          }

        } else {
          console.log('No Instance ID token available. Request permission to generate one.');
          setTokenSentToServer(false);
        }
      });

      push.on('notification', function (data) {
        // console.log("notification event");

        // saveNotification(data);
        $scope.loadNotification();

        $scope.$apply(function () {
          $scope.Badge = NotificationServices.badge();
        })

        if (data.additionalData.foreground) {
          // ทำเมื่อ เปิดแอพอยู่ หมายถึง กำลังใช้งาน app
          // $scope.goToState('notification');
          console.log('foreground');
          $scope.OpenToast(data);

        } else {
          // คลิกจาก notification

          if (data.additionalData.coldstart) {
            // ทำงานแบบ background กรณี ไม่ได้รันแอพ จะเปิดหน้าแรกและไป
            $scope.loadNotification();
            $scope.goToState('notification');
            // }else{
            //     // ทำงานแบบ background กรณี ย่อแอพไว้ จะไปต่อจากหน้าที่เปิดค้างไว้
            //   $scope.goToState('grade');
          }

        }

      });

      push.on('error', function (e) {
        console.log('An error occurred. ', e.message);
      });

    }

    //Init Badge
    $scope.badge = 0;

    $rootScope.$on('myCustomEvent', function (event, data) {
      $scope.Notifications = data.Notifications;
      $scope.Badge = data.Badge;
    });

    $scope.getBadge = function () {
      if (window.localStorage.getItem('Notification') == null || (typeof window.localStorage.getItem('Notification') === 'undefined')) {
        $scope.Notifications = [];
      } else {
        $scope.Notifications = JSON.parse(window.localStorage.getItem('Notification'));
      }
      NotificationServices.set($scope.Notifications);
      $scope.Badge = NotificationServices.badge();
    }
    $scope.getBadge();
    // end init badge

    function sendTokenToServer(id, token, currentToken) {
      // if (!isTokenSentToServer()) {
      console.log('Sending token to server...');
      console.log(ionic.Platform.platform());
      if (ionic.Platform.isAndroid()) {
        platform = "android";
      } else {
        platform = "ios";
      }

      var uuid = $cordovaDevice.getUUID();

      $http.post(host_notification + 'notification.php', {
          //ใช้สำหรับทดสอบ ถ้าปล่อยแอพต้อง mark sandbox ไว้
          // "sandbox": "1",

          "action": "register2",
          "app": "NisitKU",
          "id": id,
          "token": token,
          "platform": platform,
          "device_id": currentToken,
          "uuid": uuid
        })
        .success(function (response) {
          console.log(response);
          if (response.status == "true") {
            // window.localStorage.setItem('currentToken', currentToken);
            setTokenSentToServer(true);
          } else {
            setTokenSentToServer(false);
          }
        })
        .error(function (error) {
          console.log("Error storing device token.", error)
        });

      // } else {
      //   console.log('Token already sent to server so won\'t send it again unless it changes');
      // }
    }

    function delTokenFromServer(id, token, currentToken) {
      if (isTokenSentToServer()) {
        if (ionic.Platform.isAndroid()) {
          platform = "android";
        } else {
          platform = "ios";
        }
        var uuid = $cordovaDevice.getUUID();
        $http.post(host_notification + 'notification.php', {
            "action": "unregister2",
            "app": "NisitKU",
            "id": id,
            "token": token,
            "platform": platform,
            "device_id": currentToken,
            "uuid": uuid
          })
          .success(function (response) {
            // console.log(response);
            if (response.status == "true") {
              window.localStorage.removeItem('sentToServer');
            }
          })
          .error(function (error) {
            console.log("Error deleting device token.", error)
          });

      } else {
        console.log('Not have Token.');
      }
    }

    function isTokenSentToServer() {
      return window.localStorage.getItem('sentToServer') === '1';
    }

    function setTokenSentToServer(sent) {
      window.localStorage.setItem('sentToServer', sent ? '1' : '0');
    }

    function saveNotification(notification) {
      if (window.localStorage.getItem('Notification') == null || (typeof window.localStorage.getItem('Notification') === 'undefined')) {
        $scope.Notifications = [];
      } else {
        $scope.Notifications = JSON.parse(window.localStorage.getItem('Notification'));
      }
      var data = {
        title: notification.title,
        message: notification.message,
        image: notification.image
      }
      data = Object.assign(data, notification.additionalData);
      var dup_id = 0;
      for (var i = 0; i < $scope.Notifications.length; i++) {
        if ($scope.Notifications[i].id === data.id) {
          var dup_id = 1;
          break;
        }
      }
      if (dup_id === 0) {
        $scope.Notifications.unshift(data);
        NotificationServices.set($scope.Notifications);

        $rootScope.$broadcast('myCustomEvent', {
          Notifications: $scope.Notifications,
          Badge: NotificationServices.badge()
        });
      }
    }

    $scope.loadNotification = function() {

      var id = window.localStorage.getItem("id");
      var token = window.localStorage.getItem("token");
      var currentToken = window.localStorage.getItem("currentToken");

      if (window.localStorage.getItem('Notification') == null || (typeof window.localStorage.getItem('Notification') === 'undefined')) {
        $scope.Notifications = [];
      } else {
        $scope.Notifications = JSON.parse(window.localStorage.getItem('Notification'));
      }
      if (ionic.Platform.isAndroid()) {
        platform = "android";
      } else {
        platform = "ios";
      }
      var uuid = $cordovaDevice.getUUID();
      $http.post(host_notification + 'notification.php', {
          "action": "message",
          "app": "NisitKU",
          "id": id,
          "token": token,
          "platform": platform,
          "device_id": currentToken,
          "uuid": uuid
        })
        .success(function (response) {

          for (var m = 0; m < response.data.length; m++) {
            var data = response.data[m];

            var dup_id = 0;
            for (var i = 0; i < $scope.Notifications.length; i++) {
              if ($scope.Notifications[i].id === data.id) {
                var dup_id = 1;
                break;
              }
            }
            if (dup_id === 0) {
              $scope.Notifications.unshift(data);
              NotificationServices.set($scope.Notifications);

              $rootScope.$broadcast('myCustomEvent', {
                Notifications: $scope.Notifications,
                Badge: NotificationServices.badge()
              });
            }

          }

        })
        .error(function (error) {
          console.log("Error loading message to device.", error)
        });
    }

    $scope.goNotification = function () {
      PushNotification.hasPermission(data => {
        if (data.isEnabled) {
          $scope.goToState('notification');
        } else {
          $cordovaDialogs.alert('กรณีไม่อนุญาต จะไม่สามารถรับข้อความแจ้งเตือนได้', "Please allow Notifications", 'OK')
            .then(function () {});
        }
      });
    };
    // end

    $scope.goToState = function (state) {
      $state.go(state);
    };

    $scope.openURL = function (url) {
      window.open(url, '_system', 'location=yes');
    }

    $scope.openVoteURL = function (url) {
      window.open(url, '_blank', 'location=no,closebuttoncaption= ย้อนกลับหน้าหลัก');
    }

    $scope.getForgetPassword = function () {
      $http
        .post(host + 'nisit/Controller.php', {
          'action': 'getForgetPassword'
        })
        .success(function (response) {
          $scope.openURL(response.url);
        });
    }

    $scope.showLogin = function () {
      var cardSlug = window.localStorage.getItem("card_slug");
      var name_en = window.localStorage.getItem("name_en");
      var imgProfile = window.localStorage.getItem("imgProfile");
      $scope.iconLogin = true;
      $scope.iconProfile = false;
      if (cardSlug) {
        $scope.iconLogin = false;
        $scope.iconProfile = true;
        $scope.img_profile = imgProfile || "img/kulogo.png";
        $scope.name_en = name_en || cardSlug;
      }
    };
    $scope.showLogin();
    $rootScope.$on('$stateChangeSuccess', function() {
      $scope.showLogin();
    });
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('nisit/login.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function () {
      $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function () {
      $scope.err_msg = '';
      $scope.modal.show();
    };

    $scope.backHome = function () {
      // var id = window.localStorage.getItem("id");
      // if (id == null) {
      //   $state.go('main');
      // } else {
      //   $state.go('nisit');
      // }
      $state.go('main');
    };

    // $scope.backMain = function () {
    //   $ionicHistory.nextViewOptions({
    //     historyRoot: true
    //   });
    //   $state.go('tab.main');
    // }

    $scope.goBack = function () {
      // $ionicNavBarDelegate.back();
      $ionicHistory.goBack();
    };

    // Login: save card slug to localStorage, reload so mock_notext picks it up
    $scope.err_msg = '';
    $scope.doLogin = function (loginData) {
      var slug = (loginData.username || '').trim().toLowerCase().replace(/\s+/g, '_');
      if (!slug) { alert('กรุณาใส่ชื่อการ์ด'); return; }

      var found = false;
      var candidates = ['cards/' + slug + '.json', 'img/' + slug + '.json'];
      for (var i = 0; i < candidates.length; i++) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', candidates[i], false);
        try { xhr.send(); } catch(e) {}
        if (xhr.status === 200 || xhr.status === 0) { found = true; break; }
      }
      if (!found) { alert('ไม่พบการ์ดชื่อ "' + slug + '"'); return; }

      window.localStorage.setItem('card_slug', slug);
      $scope.closeLogin();
      window.location.reload();
    };

    $scope.logout = function () {
      if (!window.confirm('ต้องการออกจากระบบ?')) { $scope.closeMoreModal(); return; }
      window.localStorage.removeItem('card_slug');
      window.localStorage.removeItem('id');
      window.localStorage.removeItem('token');
      window.localStorage.removeItem('imgProfile');
      window.localStorage.removeItem('name_th');
      window.localStorage.removeItem('surname_th');
      window.localStorage.removeItem('name_en');
      window.localStorage.removeItem('Notification');
      try { $scope.closeMoreModal(); } catch(e) {}
      try { $scope.closePopover(); } catch(e) {}
      // Navigate to clean URL (no ?card=) so mock_notext won't re-save card_slug
      window.location.href = window.location.pathname;
    };

    $scope.profile = function () {
      $state.go('nisit_profile');
      $scope.closePopover();
    };

    $scope.kuappstore = function () {
      $scope.openURL('http://kuappstore.ku.ac.th/');
      $scope.closePopover();
    };

    $scope.studentguide = function () {
      $scope.showManual();
      $scope.closePopover();
    };

    $scope.openPopover = function ($event) {
      $scope.popover.show($event);
    };
    $scope.closePopover = function () {
      $scope.popover.hide();
    };

    $ionicPopover.fromTemplateUrl('nisit/popover.html', {
      scope: $scope,
    }).then(function (popover) {
      $scope.popover = popover;
    });

    $ionicModal.fromTemplateUrl('nisit/modal-more.html', {
      id: '3',
      scope: $scope,
      animation: 'slide-in-down'
    }).then(function(modal) {
      $scope.moreModal = modal;
    });
    $scope.openMoreModal = function() {
      $scope.moreModal.show();
    };

    $scope.closeMoreModal = function() {
      $scope.moreModal.hide();
    };

    $scope.showManual = function () {
      $http
        .post(host + 'nisit/Controller.php', {
          'action': 'getManual'
        })
        .success(function (response) {
          // Show the action sheet
          var hideSheet = $ionicActionSheet.show({
            buttons: response[0].buttonList,
            titleText: 'Student Guide',
            buttonClicked: function (index) {
              $scope.openURL(response[0].urlList[index]);
            }
          });
        });
    }

    $scope.renderHtml = function (htmlCode) {
      return $sce.trustAsHtml(htmlCode);
    };

    $scope.goToModule = function(module) {
      window.open(module, '_system', 'location=yes');
    };

    $scope.getEula = function () {
      $http
        .post(host + 'nisit/Controller.php', {
          'action': 'eula'
          // 'id': id,
          // 'token': token
        })
        .success(function (response) {
          if (response[0].status == "true") {
            $scope.eula = response[0].data;
          }
        })
        .error(function (error) {
          $scope.item = '{"status" : false , "msg_desc" : "' + error + '"}';
        });
    }

     // Start PR //
     $scope.prContent = [];
     $scope.getPR = function(searchTxt) {
       var id = window.localStorage.getItem("id");
       var token = window.localStorage.getItem("token");
         $http
         .post(host + 'news/Controller.php', {
             'action': 'news',
             'id':id,
             'token': token
         })
         .success(function(response) {
             if (response.status == "true") {
                 $scope.prContent = response.data;
             }
         });
     };

    $scope.goToPrDetail = function(prDetail){
      PrServices.set(prDetail);
      $state.go('pr-detail');
    }

  })

  .controller('MainCtl', function ($scope, $http, $state, $location, $ionicPopup, $ionicLoading, $ionicActionSheet, $ionicSlideBoxDelegate) {
    $scope.eventsLists = [];
    $scope.getEvents = function () {
      $http
        .post(host + 'events/Controller.php', {
          "action": "list",
          "event_view": "month"
        })
        .success(function (response) {
          if (response[0].status == "true") {
            $scope.eventsLists = response[0].events;
          }
        })
        .error(function (error) {
          $scope.item = '{"status" : false , "msg_desc" : "' + error + '"}';
        });
    }
    $scope.hilightLists = [];
    $scope.getHilight = function () {
      $http
        .post(host + 'news/Controller.php', {
          'action': 'list'
        })
        .success(function (response) {
          if (response[0].status == "true") {
            $scope.hilightLists = response[0].news;
            $ionicSlideBoxDelegate.update();
          }
        })
        .error(function (error) {
          $scope.item = '{"status" : false , "msg_desc" : "' + error + '"}';
        });

    }
    $scope.getHilight();

    $scope.slideHasChanged = function (index) {
      $scope.slideIndex = index;
      if (($ionicSlideBoxDelegate.$getByHandle('sliderBan').count() - 1) == index) {
        setTimeout(function () {
          $ionicSlideBoxDelegate.$getByHandle('sliderBan').slide(0);
        }, 1000);
      }
    };

    $scope.goToSmartBUS = function () {
      $http
        .get('https://kuappstore.ku.ac.th/insideku/SmartBUS.php')
        .success(function (response) {
          window.open(encodeURI(response.url), '_blank', 'location=no,closebuttoncaption= ย้อนกลับหน้าหลัก');
        })
        .error(function (error) {
          var url = encodeURI("https://kuappstore.ku.ac.th/insideku/SmartBUS.php");
          window.open(url, '_blank', 'location=no,closebuttoncaption=ย้อนกลับหน้าหลัก');
        });
    }

    $scope.goToNews = function () {
      // console.log('goToNews');
      $http
        .get('https://kuappstore.ku.ac.th/insideku/KUNews.php')
        .success(function (response) {
          window.open(encodeURI(response.url), '_blank', 'location=no,closebuttoncaption= ย้อนกลับหน้าหลัก');
        })
        .error(function (error) {
          var url = encodeURI("https://www.ku.ac.th");
          window.open(url, '_blank', 'location=no,closebuttoncaption=ย้อนกลับหน้าหลัก');
        });
    }

  })

  .controller('InfoCtl', function ($scope, $http, $location, $ionicPopup, $ionicLoading, $ionicPopover) {

  })

  .controller('PrCtl', function ($scope, $http) {
    var id = window.localStorage.getItem("id");
    var token = window.localStorage.getItem("token");
    $scope.noMoreItemsAvailable = true;
    $scope.page = 1;
    $scope.prContent = [];
    $scope.getPRInit = function(searchTxt) {
      $scope.noMoreItemsAvailable = true;
      $scope.page = 1;
        $http
        .post(host + 'news/Controller.php', {
            'action': 'news',
            'all': '1',
            'page': 1,
            'id':id,
            'token': token,
            'keyword' : searchTxt
        })
        .success(function(response) {
            if (response.status == "true") {
                $scope.prContent = response.data;
                $scope.noMoreItemsAvailable = false;
                $scope.$broadcast('scroll.refreshComplete');
            } else {
                $scope.prContent = [];
                $scope.noMoreItemsAvailable = true;
            }
        });
    };

    $scope.prMore = function(searchTxt) {
        $scope.page += 1;
        $http
        .post(host + 'news/Controller.php', {
            'action': 'news',
            'all': '1',
            'id':id,
            'token': token,
            'page': $scope.page,
            'keyword' : searchTxt
        })
        .success(function(response) {
            if (response.status == "true") {
                $scope.prContent = $scope.prContent.concat(response.data);
                $scope.$broadcast('scroll.infiniteScrollComplete');
            } else {
                $scope.noMoreItemsAvailable = true;
            }
        });
    };
  })

  .controller('PrDetailCtl', function($scope,  PrServices) {
    $scope.prDetail = PrServices.get();
  })

  .controller('QuickLinkCtl', function ($scope, $http) {
    $scope.lang = 'th';

    $scope.linkLists = [];

    $scope.getLink = function () {
      $http
        .post(host + 'link/Controller.php', {
          'action': 'list',
          'lang': $scope.lang
        })
        .success(function (response) {
          if (response[0].status == "true") {
            $scope.linkLists = response[0].link;
          }
        })
        .error(function (error) {
          $scope.item = '{"status" : false , "msg_desc" : "' + error + '"}';
        });
    }

  })




