NisitModule.controller('NisitCtl', function ($scope, $http, $location, $ionicPopup, $ionicLoading, $ionicPopover, $stateParams, $ionicSlideBoxDelegate, $ionicActionSheet, $ionicModal,$q,$cordovaSocialSharing) {
  var id = window.localStorage.getItem("id");
  var token = window.localStorage.getItem("token");
  $scope.TranscriptDetail = false;

  $scope.act_notfound = act_notfound;
  $scope.act_info = act_info;
  $scope.act_url = act_url;

  $scope.showBarcode = true;
  $scope.changeBarcode = function () {
    $scope.showBarcode = !$scope.showBarcode;
  }

  $scope.getProfile = function () {
    $http
      .post(host + 'nisit/Controller.php', {
        'action': 'profile',
        'id': id,
        'token': token
      })
      .success(function (response) {
        if (response[0].status == "true") {
          $scope.profileNisit = response[0];
        }
      })
      .error(function (error) {
        $scope.item = '{"status" : false , "msg_desc" : "' + error + '"}';
      });
  }

  $scope.getProfile27 = function () {
    $http
      .post(host + 'nisit/Controller.php', {
        'action': 'profile',
        'ver': '2.7',
        'id': id,
        'token': token
      })
      .success(function (response) {
        if (response.status == "true") {
          $scope.nisit = {
            'id' : response.id,
            'name_th' : response.name_th,
            'name_en' : response.name_en
          }
          $scope.stdInfo = response.std_data;
          $scope.advInfo = response.adv_data;
          $scope.img_qrcode = response.img_qrcode;
          $scope.img_barcode = response.img_barcode;
          $scope.img_std_qrcode = response.img_std_qrcode;
        }
      })
      .error(function (error) {
        $scope.item = '{"status" : false , "msg_desc" : "' + error + '"}';
      });
  }

  $scope.getGrade = function () {
    $http
      .post(host + 'nisit/Controller.php', {
        'action': 'grade',
        'id': id,
        'token': token
      })
      .success(function (response) {
        if (response[0].status == "true") {
          $scope.gradeNisit = response[0].grade;
        }
      })
      .error(function (error) {
        $scope.item = '{"status" : false , "msg_desc" : "' + error + '"}';
      });
  }

  $scope.getRegister = function () {
    $http
      .post(host + 'nisit/Controller.php', {
        'action': 'register',
        'id': id,
        'token': token
      })
      .success(function (response) {
        if (response[0].status == "true") {
          $scope.registerNisit = response[0].register;
        }
      })
      .error(function (error) {
        $scope.item = '{"status" : false , "msg_desc" : "' + error + '"}';
      });
  }

  $scope.theme = 'light';
  $scope.portrait = false;

  $scope.setTheme = function () {
    if($scope.theme=='light'){
      $scope.theme = 'dark';
    }else{
      $scope.theme = 'light';
    }
    $scope.setTimetableImg();
  }
  $scope.setLayout = function () {
    $scope.portrait = !$scope.portrait;
    $scope.setTimetableImg();
  }
  $scope.setTimetableImg = function () {
    if($scope.theme=='light'&&$scope.portrait){
      $scope.timetable_img = $scope.timetable_light_p;
    }
    if($scope.theme=='light'&&!$scope.portrait){
      $scope.timetable_img = $scope.timetable_light;
    }
    if($scope.theme=='dark'&&$scope.portrait){
      $scope.timetable_img = $scope.timetable_dark_p;
    }
    if($scope.theme=='dark'&&!$scope.portrait){
      $scope.timetable_img = $scope.timetable_dark;
    }
  }


  var buildImage = function(img) {
    var deferred = $q.defer();
    // create the canvas
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');

    // draw avatar image on the left
    var avatar = new Image();
    avatar.crossOrigin="anonymous";
    avatar.onload = function() {
        canvas.height = this.height+40;
        canvas.width = this.width+40;

        context.beginPath();
        context.fillStyle = "rgba(0,0,0,0)";
        context.rect(0, 0, this.width+40, this.height+40);
        context.fill();

        context.drawImage(this, 20, 20);

        deferred.resolve(canvas);
    };
    avatar.src = img;

    return deferred.promise;
  };

  $scope.openSocialShare = function() {
    buildImage($scope.timetable_img).then(function(canvas) {
      return $cordovaSocialSharing.share(null, null, canvas.toDataURL());
    })
    .then(function() {
        console.log('Shared successfully');
    }, function(err) {
        console.log('Error while sharing');
    });

  };

  $scope.loadingCsTime = 1;
  $scope.getCsTime = function () {
    $scope.loadingCsTime = 1;
    $scope.colorDay = {
      "Monday": "#f7f4a7",
      "Tuesday": "#f6caf3",
      "Wednesday": "#cafade",
      "Thursday": "#ffcda3",
      "Friday": "#dbfbff",
      "Saturday": "#c4abed",
      "Sunday": "#ffaab5"
    };
    $http
      .post(host + 'nisit/Controller.php', {
        'action': 'cs_time',
        'id': id,
        'token': token
      })
      .success(function (response) {
        if (response[0].status == "true") {
          $scope.timetable_light = response[0].timetable_light;
          $scope.timetable_dark = response[0].timetable_dark;
          $scope.timetable_light_p = response[0].timetable_light_p;
          $scope.timetable_dark_p = response[0].timetable_dark_p;

          $scope.setTimetableImg();

          $scope.CsTimeNisit = response[0].cstime;
          $scope.colorDay = response[0].color_day;
          for (var i = 0; i < $scope.CsTimeNisit.length; i++) {
            $scope.CsTimeNisit[i].colorday = $scope.colorDay[$scope.CsTimeNisit[i].day];
          }

        }
        $scope.loadingCsTime = 0;
      })
      .error(function (error) {
        $scope.item = '{"status" : false , "msg_desc" : "' + error + '"}';
      });
  }

  $scope.getExamSchedule = function () {
    $scope.colorSet = [{
      "date_color": "#808080",
      "bg_color": "#eeeeee",
      "time_color": "#999999",
      "course_color": "#999999",
      "build_color": "#999"
    }, {
      "date_color": "#555555",
      "bg_color": "#cafade",
      "time_color": "#2c7ed4",
      "course_color": "#666",
      "build_color": "#008B00"
    }, {
      "date_color": "#555555",
      "bg_color": "#dbfbff",
      "time_color": "#2c7ed4",
      "course_color": "#666",
      "build_color": "#008B00"
    }];

    $http
      .post(host + 'nisit/Controller.php', {
        'action': 'exam',
        'id': id,
        'token': token
      })
      .success(function (response) {
        if (response[0].status == "true") {
          $scope.ExamNisit = response[0].exam_time;
          // for (var i = 0; i < $scope.ExamNisit.length; i++) {
          //   $scope.ExamNisit[i].colorday = $scope.colorDay[$scope.ExamNisit[i].day];
          // }
        }
      })
      .error(function (error) {
        $scope.item = '{"status" : false , "msg_desc" : "' + error + '"}';
      });
  }

  $scope.getRegisInfo = function () {
    $http
      .post(host + 'nisit/Controller.php', {
        'action': 'regisinfo',
        'id': id,
        'token': token
      })
      .success(function (response) {
        if (response[0].status == "true") {
          $scope.regisInfoNisit = response[0];
        }
      })
      .error(function (error) {
        $scope.item = '{"status" : false , "msg_desc" : "' + error + '"}';
      });
  }

  $scope.getKU9 = function () {
    $http
      .post(host + 'nisit/Controller.php', {
        'action': 'ku9',
        'id': id,
        'token': token
      })
      .success(function (response) {
        if (response[0].status == "true") {
          $scope.ku9Nisit = response[0];
          $ionicSlideBoxDelegate.update();
        }
      })
      .error(function (error) {
        $scope.item = '{"status" : false , "msg_desc" : "' + error + '"}';
      });
  }

  $scope.goToSmartBUS = function () {
    $http
      .get('https://kuappstore.ku.ac.th/insideku/SmartBUS.php')
      .success(function (response) {
        window.open(encodeURI(response.url), '_blank', 'location=no,closebuttoncaption= ย้อนกลับหน้าหลัก');
      })
      .error(function (error) {
        var url = encodeURI("http://110.49.142.74:8080/");
        window.open(url, '_blank', 'location=no,closebuttoncaption=ย้อนกลับหน้าหลัก');
      });
  }

  $scope.goToNews = function () {
    console.log('goToNews');
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

  $scope.getActReport = function () {
    $scope.act_info = "";
    $scope.act_url = "";
    $ionicLoading.show();
    $http
      .post(host + 'nisit/Controller.php', {
        'action': 'actreport',
        'id': id,
        'token': token
      })
      .success(function (response) {
        if (response[0].status == "true") {
          $scope.actReportNisit = response[0];
          $scope.act_notfound = 0;
          act_notfound = 0;
        } else {
          $scope.act_notfound = 1;
          $scope.act_info = response[0].act_info;
          $scope.act_url = response[0].act_url;

          act_notfound = 1;
          act_info = response[0].act_info;
          act_url = response[0].act_url;
        }
        $ionicLoading.hide();
      })
      .error(function (error) {
        $scope.item = '{"status" : false , "msg_desc" : "' + error + '"}';
        $ionicLoading.hide();
      });
  }

  $scope.getActDetail = function () {
    $scope.act_info = "";
    $scope.act_url = "";
    $ionicLoading.show();
    $http
      .post(host + 'nisit/Controller.php', {
        'action': 'actdetailb3',
        'id': id,
        'token': token
      })
      .success(function (response) {
        if (response[0].status == "true") {
          $scope.actDetailNisit = response[0];
          $scope.TranscriptDetail = true;
          // } else {
          //   $scope.act_notfound = 1;
          //   $scope.act_info = response[0].act_info;
          //   $scope.act_url = response[0].act_url;
        }
        $ionicLoading.hide();
      })
      .error(function (error) {
        $scope.item = '{"status" : false , "msg_desc" : "' + error + '"}';
        $ionicLoading.hide();
      });
  }

  $scope.campusid = $stateParams.campusid;
  $scope.getActCalendarDetail = function (campusid) {
    $ionicLoading.show();
    $http
      .post(host + 'nisit/Controller.php', {
        'action': 'actcalendardetail',
        'id': id,
        'campusid': campusid,
        'token': token
      })
      .success(function (response) {
        if (response[0].status == "true") {
          $scope.actCalendarNisit = response[0];
        }
        $ionicLoading.hide();
      })
      .error(function (error) {
        $scope.item = '{"status" : false , "msg_desc" : "' + error + '"}';
        $ionicLoading.hide();
      });
  }

  $scope.getActCalendarDetail2 = function (campusid) {
    $ionicLoading.show();
    $http
      .post(host + 'nisit/Controller.php', {
        'action': 'actcalendardetail',
        'id': id,
        'campusid': campusid,
        'view': '2',
        'token': token
      })
      .success(function (response) {
        if (response[0].status == "true") {
          $scope.actCalendarNisit = response[0];
        }
        $ionicLoading.hide();
      })
      .error(function (error) {
        $scope.item = '{"status" : false , "msg_desc" : "' + error + '"}';
        $ionicLoading.hide();
      });
  }

  $scope.getActCalendar = function () {
    $ionicLoading.show();
    $http
      .post(host + 'nisit/Controller.php', {
        'action': 'actcalendar',
        'id': id,
        // 'campusid': campusid,
        'token': token
      })
      .success(function (response) {
        if (response[0].status == "true") {
          $scope.actCalendarNisit = response[0];
        }
        $ionicLoading.hide();
      })
      .error(function (error) {
        $scope.item = '{"status" : false , "msg_desc" : "' + error + '"}';
        $ionicLoading.hide();
      });
  }

  $scope.toggleGroup = function (group) {
    group.show = !group.show;
  };
  $scope.isGroupShown = function (group) {
    return group.show;
  };

  $scope.act_view = "type";
  $scope.showDay = true;

  $scope.changeView = function () {
    if ($scope.act_view == "type") {
      $scope.act_view = "day";
      $scope.getActCalendarDetail($scope.campusid);
    } else {
      $scope.act_view = "type";
      $scope.getActCalendarDetail2($scope.campusid);
    }
    $scope.showDay = !$scope.showDay;
  }

  $scope.showCompCode = function (banklist) {
    // Show the action sheet
    var hideSheet = $ionicActionSheet.show({
      buttons: banklist,
      titleText: 'COMP CODE'
    });
  }
  // $scope.showBarCode = function(img) {
  //   var hideSheet = $ionicActionSheet.show({
  //     buttons: [{ text : '<img src="'+img+'">'}],
  //     titleText: 'Bill Payment [KU9]'
  //   });
  // }
  $ionicModal.fromTemplateUrl('nisit/barcode.html', {
    id: '1',
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.BarcodeModal = modal;
  });
  $scope.openBarcodeModal = function (barcode) {
    $scope.barcode = barcode;
    $scope.BarcodeModal.show();
  };
  $scope.closeBarcodeModal = function () {
    $scope.BarcodeModal.hide();
  };

  ///////////////



})


