var host_vote = "https://kuappstore.ku.ac.th/vote/";

VoteModule.controller('VoteCtl', function ($scope, $state, $http, VoteServices, $stateParams, $cordovaDialogs, $cordovaGeolocation, $cordovaDevice, $timeout, $ionicModal) {
    var id = window.localStorage.getItem("id");
    var token = window.localStorage.getItem("token");

    $scope.getVoteBanner = function () {
      $http
        .post(host_vote + 'api.php', {
          "action": "banner",
          "app": "NisitKU",
          "id": id,
          "token": token
        })
        .success(function (response) {
          if (response.status == "true") {
            $scope.bannerLists = response.data;
            $scope.checkinContact = response.checkinContact;
            $scope.yearLists = response.data.year;
            $scope.selectYearTxt = $scope.yearLists[0].text;
            $scope.year = $scope.yearLists[0].value;
            $scope.voteContact = response.voteContact;
          }
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

    // ######## VOTE ########

    $scope.voteContent = [];
    $scope.getVoteInit = function (searchTxt) {
      $scope.loadingVote = 1;
      $http
        .post(host_vote + 'api.php', {
          "action": "list",
          "app": "NisitKU",
          "id": id,
          "token": token
        })
        .success(function (response) {
          if (response.status == "true") {
            $scope.voteContent = response.data;
            $scope.loadingVote = 0;
          } else {
            $scope.voteContent = [];
            $scope.loadingVote = 1;
            document.querySelector('#votenotfound').innerHTML = 'ไม่พบข้อมูล';
          }
        });
    };

    $scope.goToVoteDetail = function (voteDetail) {
      VoteServices.setVoteDetail(voteDetail);
      $state.go('nisit_vote-detail');
    }

    $scope.goToVoteLogDetail = function (voteDetail) {
      VoteServices.setVoteDetail(voteDetail);
      $state.go('nisit_vote-detail-log');
    }

    $scope.goToModule = function (module) {
      window.open(module, '_system', 'location=yes');
    }

    // ######## VOTE LOG ########

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
          $scope.getVoteLog(year[result[0].index].value);
        });
      }, function (error) {
        // console.log(error);
      });
    }

    $scope.getVoteLog = function (year) {
      $scope.loadingVoteLog = 1;
      $scope.voteLogList = [];
      $http
        .post(host_vote + 'api.php', {
          "action": "logs",
          "app": "NisitKU",
          "id": id,
          "token": token,
          "year": year
        })
        .success(function (response) {
          if (response.status == "true") {
            $scope.voteLogList = response.data;
            $scope.loadingVoteLog = 0;
          } else {
            $scope.loadingVoteLog = 1;
            $scope.voteLogList = [];
            document.querySelector('#votenotfound').innerHTML = 'ไม่พบข้อมูล';
          }
        });
    }

  })

  .controller('VoteDetailCtl', function ($scope,$http, $cordovaDialogs, $state,VoteServices, $cordovaDevice,$rootScope) {
    var id = window.localStorage.getItem("id");
    var token = window.localStorage.getItem("token");
    $scope.voteDetail = VoteServices.getVoteDetail();

    if($rootScope.previousState) {
      if($rootScope.previousState.name == "nisit_choice-detail"){
        if($rootScope.savedScopes) {
          for (key in $rootScope.savedScopes) {
              $scope[key] = $rootScope.savedScopes[key];
          }
        }
      }else{
        $scope.no_vote = {
          checked : false
        };
        $scope.choose = {};

        $scope.checkedNumber = 0;
      }
    }else{
      $scope.no_vote = {
        checked : false
      };
      $scope.choose = {};

      $scope.checkedNumber = 0;
    }

    $rootScope.$on('$stateChangeStart', function (event, toState, toStateParams, fromState, fromParams) {
        $rootScope.previousState = fromState;
        $rootScope.previousStateParams = fromParams;
    });

    $scope.$on('$locationChangeStart', function(event, next, current) {
        $rootScope.savedScopes = {
          no_vote: $scope.no_vote,
          choose: $scope.choose,
          checkedNumber: $scope.checkedNumber
        };
    });

    $scope.limitNumber = $scope.voteDetail.vote_max;
    $scope.check = function(item) {
      if (item.checked) {
        $scope.checkedNumber++;
      } else {
        $scope.checkedNumber--;
      }
    }

    $scope.isObjectEmpty = function(choose){
      return Object.keys(choose).length === 0;
   }

    $scope.confirmVote = function () {
      $cordovaDialogs.confirm('ยืนยันการลงคะแนน', 'NisitKU', ['OK', 'Cancel'])
        .then(function (res) {
          if (res == true) {
            saveVoted();
          }
        });

      function saveVoted() {
        var choose = $scope.choose;
        var vote_id = $scope.voteDetail.vote_id;
        var vote_type = $scope.voteDetail.vote_type;
        var choice = $scope.voteDetail.choice;
        var no_vote = $scope.no_vote;
        var uuid = $cordovaDevice.getUUID();
        var param = {
          "action" : "vote",
          "app" : "NisitKU",
          "id": id,
          "token": token,
          "uuid" : uuid,
          "vote_id" : vote_id,
          "vote_type" : vote_type,
          "no_vote" : JSON.stringify(no_vote),
          "choose" : JSON.stringify(choose),
          "choice" : JSON.stringify(choice)
        }
        $http.post(host_vote+'api.php',param)
          .success(function (response) {
            if(response.status=="true"){
              // alert(JSON.stringify(response));
              $cordovaDialogs.alert(response.msg_desc,'NisitKU', 'OK')
              .then(function() {
                $state.go('nisit_vote');
              });
            }else{
              $scope.choose = {};
              $cordovaDialogs.alert(response.msg_desc,'NisitKU', 'OK')
              .then(function() {
                $state.go('nisit_vote');
              });
            }
          })
          .error(function (error) {
          });

      }
    }

    $scope.goToModule = function(module) {
      window.open(module, '_system', 'location=yes');
    }
    $scope.goToChoiceDetail = function (choiceDetail) {
      VoteServices.setChoiceDetail(choiceDetail);
      $state.go('nisit_choice-detail');
    }

  })

  .controller('VoteDetailCtl2', function ($scope, VoteServices) {
    var id = window.localStorage.getItem("id");
    var token = window.localStorage.getItem("token");
    $scope.voteDetail = VoteServices.getVoteDetail();
  })

  .controller('ChoiceDetailCtl', function ($scope, $state,VoteServices) {
    var id = window.localStorage.getItem("id");
    var token = window.localStorage.getItem("token");
    $scope.choiceDetail = VoteServices.getChoiceDetail();
    $scope.voteDetail = VoteServices.getVoteDetail();

    $scope.goToModule = function(module) {
      window.open(module, '_system', 'location=yes');
    }

    $scope.goBackVoteDetail = function (voteDetail) {
      VoteServices.setVoteDetail(voteDetail);
      $state.go('nisit_vote-detail');
    }

  })
