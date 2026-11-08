KuLibraryModule.controller('KuLibraryCtl', function ($scope, $http) {
  var id = window.localStorage.getItem("id");
  var token = window.localStorage.getItem("token");
  $scope.lang = 'th';
  // $scope.memberInfo = {};

  $scope.getKuLibraryBanner = function () {
    $http
      .post(hostlib + 'kulib.php', {
        "action": "banner"
      })
      .success(function (response) {
        if (response.status == "true") {

          $scope.bannerLists = response.data;

        }
      })
      .error(function (error) {
        $scope.item = '{"status" : false , "msg_desc" : "' + error + '"}';
      });
  }

  $scope.loadingMember = 1;
  $scope.getMemberInfo = function () {
    $scope.loadingMember = 1;
    $http
      .post(hostlib + 'kulib.php', {
        'action': 'patron',
        'ver': '2.7',
        'app': 'NisitKU',
        'id': id,
        'token': token
      })
      .success(function (response) {
        if (response.status == "true") {
          $scope.memberInfo = response.data;
          if ($scope.memberInfo.length != 0) {
            $scope.nisit = {
              'id' : response.id,
              'name_th' : response.name_th,
              'name_en' : response.name_en
            }
            $scope.img_qrcode = response.img_qrcode;
            $scope.img_barcode = response.img_barcode;
            $scope.card_banner = response.card_banner;
            $scope.loadingMember = 0;
          }
        }
        angular.element(document.querySelector('.notfound'))[0].innerHTML = 'ไม่พบข้อมูล';
        $scope.libContact = response.libContact;
      })
      .error(function (error) {
        $scope.item = '{"status" : false , "msg_desc" : "' + error + '"}';
      });
  }

  $scope.loadingBorrow = 1;
  $scope.getBorrow = function () {
    $scope.loadingBorrow = 1;
    $http
      .post(hostlib + 'kulib.php', {
        'action': 'borrow',
        'app': 'NisitKU',
        'id': id,
        'token': token
      })
      .success(function (response) {
        if (response.status == "true") {
          $scope.borrow = response.data;
          if ($scope.borrow.books.length != 0) {
            // $scope.borrow = response.data;
            $scope.loadingBorrow = 0;
          }
        }
        angular.element(document.querySelector('.notfound'))[0].innerHTML = 'ไม่พบข้อมูล';
        $scope.libContact = response.libContact;
      })
      .error(function (error) {
        $scope.item = '{"status" : false , "msg_desc" : "' + error + '"}';
      });
  }

  $scope.loadingOverDue = 1;
  $scope.getOverDue = function () {
    $scope.loadingOverDue = 1;
    $http
      .post(hostlib + 'kulib.php', {
        'action': 'overdue',
        'app': 'NisitKU',
        'id': id,
        'token': token
      })
      .success(function (response) {
        if (response.status == "true") {
          $scope.overdue = response.data;
          if ($scope.overdue.books.length != 0) {
            // $scope.borrow = response.data;
            $scope.loadingOverDue = 0;
          }
        }
        angular.element(document.querySelector('.notfound'))[0].innerHTML = 'ไม่พบข้อมูล';
        $scope.libContact = response.libContact;
      })
      .error(function (error) {
        $scope.item = '{"status" : false , "msg_desc" : "' + error + '"}';
      });
  }

  $scope.loadingReadingLog = 1;
  $scope.getReadingLog = function () {
    $scope.loadingReadingLog = 1;
    $http
      .post(hostlib + 'kulib.php', {
        'action': 'readinglog',
        'app': 'NisitKU',
        'id': id,
        'token': token
      })
      .success(function (response) {

        if (response.status == "true") {
          $scope.readinglog = response.data;
          if ($scope.readinglog.books.length != 0) {
            // $scope.borrow = response.data;
            $scope.loadingReadingLog = 0;
          }
        }
        angular.element(document.querySelector('.notfound'))[0].innerHTML = 'ไม่พบข้อมูล';
        $scope.libContact = response.libContact;
      })
      .error(function (error) {
        $scope.item = '{"status" : false , "msg_desc" : "' + error + '"}';
      });
  }

  $scope.toggleGroup = function (group) {
    group.show = !group.show;
  };
  $scope.isGroupShown = function (group) {
    return group.show;
  };

})

