ExamScoreModule.controller('ExamScoreCtl', function ($scope, $http) {
    var id = window.localStorage.getItem("id");
    var token = window.localStorage.getItem("token");
    $scope.lang = 'th';
  
    $scope.loadingExamScore = 1;
    $scope.getExamScore = function () {
      $scope.loadingExamScore = 1;
      $http
        .post(hostmessage + 'notification.php', {
          'action': 'score',
          'app': 'NisitKU',
          'id': id,
          'token': token
        })
        .success(function (response) {
  
          if (response.status == "true") {
            $scope.banner = response.banner;
            $scope.title = response.title;
            $scope.sub_title = response.sub_title;
            $scope.examscore = response.data;
            if ($scope.examscore.course.length != 0) {
              $scope.loadingExamScore = 0;
            }
          }
          angular.element(document.querySelector('.notfound'))[0].innerHTML = 'ไม่พบข้อมูล';
          $scope.scoreContact = response.scoreContact;
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
  
  