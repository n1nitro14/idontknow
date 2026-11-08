var host_checkin = "https://kuappstore.ku.ac.th/checkin/";

CheckInModule.controller('CheckInCtl', function($scope ,$state, $http,CheckInServices,$stateParams,$cordovaDialogs, $cordovaGeolocation,$cordovaDevice, $timeout, $ionicModal) {
  var id = window.localStorage.getItem("id");
  var token = window.localStorage.getItem("token");

  $scope.showCamera = false;
  $scope.amptime = new Date().getTime();

  $scope.getCheckInBanner = function () {
    $http
      .post(host_checkin + 'api.php', {
        "action" : "banner",
        "app" : "NisitKU",
        "id" : id,
        "token" : token
      })
      .success(function (response) {
        if (response.status == "true") {
          $scope.bannerLists = response.data;
          $scope.checkinContact = response.checkinContact;
          $scope.yearLists = response.data.year;
          $scope.selectYearTxt = $scope.yearLists[0].text;
          $scope.year = $scope.yearLists[0].value;
        }
      })
      .error(function (error) {
        $scope.item = '{"status" : false , "msg_desc" : "' + error + '"}';
      });
  }

  function onDone(err, status){
    if (err) {
        // here we can handle errors and clean up any loose ends.
        console.error(err);
    }
    if (status.authorized) {
        document.querySelector('ion-nav-view').classList.add('cameraView');
        document.querySelector('#qrscanner').classList.add('cameraView');
        document.querySelector('ion-header-bar').classList.add('hideNav');
        document.querySelector('ion-content').classList.remove('has-header');

        // window.QRScanner.show();
        window.QRScanner.show(function(status){
        window.QRScanner.scan(displayContents);
        });
        // window.QRScanner.scan(displayContents);
    }else if(status.denied){
        // The video preview will remain black, and scanning is disabled. We can
        // try to ask the user to change their mind, but we'll have to send them
        // to their device settings with `QRScanner.openSettings()`.
    }else{
        // we didn't get permission, but we didn't get permanently denied. (On
        // Android, a denial isn't permanent unless the user checks the "Don't
        // ask again" box.) We can ask again at the next relevant opportunity.
    }
  }

  function displayContents(err, text){
      if(err){
          // an error occurred, or the scan was canceled (error code `6`)
      } else {
        $scope.QrContent = text;
        getInfo(text);
        window.QRScanner.hide(function(status){
          document.querySelector('ion-nav-view').classList.remove('cameraView');
          document.querySelector('#qrscanner').classList.remove('cameraView');
          document.querySelector('ion-header-bar').classList.remove('hideNav');
          document.querySelector('ion-content').classList.add('has-header');
        });
        window.QRScanner.destroy();
        $scope.showCamera = false;
      }
  }

  function getInfo(content){
    var param = {
      "action" : "activity",
      "app" : "NisitKU",
      "id": id,
      "token": token,
      "content" : content
    }
    $http.post(host_checkin+'api.php',param)
      .success(function (response) {
        if(response.status=="true"){
          // alert(JSON.stringify(response));
          $scope.content = response.data;
          // CheckInServices.set(response.data);
          $scope.openPoster($scope.content);
        }else{
          $scope.content = null;
          $cordovaDialogs.alert('สแกนอีกครั้ง', "ไม่พบข้อมูล", 'OK')
          .then(function() {
          });
        }
      })
      .error(function (error) {
          console.log("Error Setting List." ,error)
      });
  }

  $scope.closeCamera = function() {
    $scope.showCamera = false;
    window.QRScanner.hide(function(status){
      document.querySelector('ion-nav-view').classList.remove('cameraView');
      document.querySelector('#qrscanner').classList.remove('cameraView');

      document.querySelector('ion-header-bar').classList.remove('hideNav');
      document.querySelector('ion-content').classList.add('has-header');
    });
    window.QRScanner.destroy();
  };

  $scope.light_qr = function() {
      if (document.querySelector("#light_qr").src.match('off')) {
          QRScanner.enableLight(function(err, status){
              err && console.error(err);
              console.log(status);
          });
          document.querySelector("#light_qr").src = "img/light_on.png";
      } else {
          QRScanner.disableLight(function(err, status){
              err && console.error(err);
              console.log(status);
          });
          document.querySelector("#light_qr").src = "img/light_off.png";
      }
  };

  $scope.doScan = function() {
    $scope.showCamera = true;
    window.QRScanner.prepare(onDone);
  };
  
  $scope.getCheckInLog = function (searchTxt,year) {
    $scope.loadingCheckInLog = 1;
    $scope.checkinList = [];
    $http
      .post(host_checkin + 'api.php', {
        "action" : "logs",
        "app" : "NisitKU",
        'id': id,
        'token': token,
        "keyword" : searchTxt,
        "year" : year
      })
      .success(function(response) {
        if (response.status == "true") {
          $scope.checkinList = response.data;
          $scope.loadingCheckInLog = 0;
        } else {
          $scope.loadingCheckInLog = 1;
          $scope.checkinList = [];
          document.querySelector('#checkinnotfound').innerHTML = 'ไม่พบข้อมูล';
        }
      });
  }

    $scope.toggleGroup = function (group) {
      group.show = !group.show;
    };
    $scope.isGroupShown = function (group) {
      return group.show;
    };

    // ######## CHECK IN LOG ########

    $scope.selectYear = function () {
      var year = $scope.yearLists;
      var config = {
        title: "เลือกปี",
        items: [
          [year]
        ],
        defaultItems: {
          0: $scope.selectYearTxt
        },
        wrapWheelText: true,
        positiveButtonText: "ตกลง",
        negativeButtonText: "ยกเลิก",
        displayKey: "text"
      };
  
      window.SelectorCordovaPlugin.showSelector(config, function (result) {
        $scope.$apply(function () {
          $scope.selectYearTxt = result[0].text;
          $scope.year = year[result[0].index].value;     
          $scope.getCheckInLog($scope.searchTxt,year[result[0].index].value);
        });
      }, function (error) {
        // console.log(error);
      });
    }

    $scope.goToCheckInDetail = function(checkinDetail){
      CheckInServices.setCheckInDetail(checkinDetail);
      $state.go('nisit_checkin-detail');
    };

    $ionicModal.fromTemplateUrl('nisit/checkin-confirm.html', {
      id: '1',
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.PosterModal = modal;
    });

    $scope.openPoster = function(content) {
      // $scope.poster = img;
      // $scope.caption = caption;
      $scope.content= content;
      $scope.PosterModal.show();
    };

    $scope.closePosterModal = function() {
      $scope.PosterModal.hide();
    };

    $scope.CheckInActivity = function(){
      var currentPlatform = ionic.Platform.platform();

      cordova.plugins.diagnostic.isLocationEnabled(function(enabled){
        if(!enabled){
          $cordovaDialogs.alert('กรุณาเปิดการระบุตำแหน่งอุปกรณ์ของคุณ', "This app can't access to your location", 'ตั้งค่า')
          .then(function() {
            if(currentPlatform=="ios"){
              cordova.plugins.diagnostic.switchToSettings();
            }else{
              cordova.plugins.diagnostic.switchToLocationSettings();
            }
          });

        }else{

          var posOptions = {
              timeout: 10000,
              enableHighAccuracy: true
          };

          $cordovaGeolocation
              .getCurrentPosition(posOptions)
              .then(function(position) {
                  var latlng = position.coords.latitude+','+position.coords.longitude;
                  saveCheckin(latlng);
              }, function(err) {
                  //$ionicLoading.hide();
                  if (error.code == PositionError.PERMISSION_DENIED) {
                      alert("Permission denied. check setting");
                  } else if (error.code == PositionError.POSITION_UNAVAILABLE) {
                      alert("Cannot get position. May be problem with network or can't get a satellite fix.");
                  } else if (error.code == PositionError.TIMEOUT) {
                      alert("Geolocation is timed out.");
                  } else {
                      alert(error.message);
                  }
              }
          );

        }
      }, function(error){
          console.error("The following error occurred: "+error);
      });

    }

    function saveCheckin(latlng){
      var content = $scope.QrContent;
      var uuid = $cordovaDevice.getUUID();
      var param = {
        "action" : "checkin",
        "app" : "NisitKU",
        "id": id,
        "token": token,
        "uuid" : uuid,
        "location" : latlng,
        "content" : content
      }

      $http.post(host_checkin+'api.php',param)
        .success(function (response) {
          $scope.closePosterModal();
          if(response.status=="true"){
            // alert(JSON.stringify(response));
            $cordovaDialogs.alert('', response.msg_desc, 'OK')
            .then(function() {
            });
          }else{
            $scope.content = null;
            $cordovaDialogs.alert('สแกนอีกครั้ง', response.msg_desc, 'OK')
            .then(function() {
            });
          }
        })
        .error(function (error) {
            console.log("Error Setting List." ,error)
        });

    }
})

.controller('CheckInDetailCtrl', function($scope, CheckInServices) {
  $scope.id = window.localStorage.getItem("id");
	$scope.checkinDetail = CheckInServices.getCheckInDetail();
})
