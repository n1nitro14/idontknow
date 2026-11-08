
EventModule.controller('EventCtl', function($scope, $http, $location, $ionicPopup, $ionicLoading, $ionicPopover) {
  $scope.options = {
    // defaultDate: "2015-11-09",
    // minDate: "2015-01-01",
    // maxDate: "2015-12-31",
    // disabledDates: [
    //     "2015-06-22",
    //     "2015-07-27",
    //     "2015-08-13",
    //     "2015-08-15"
    // ],
    dayNamesLength: 2, // 1 for "M", 2 for "Mo", 3 for "Mon"; 9 will show full day names. Default is 1.
    mondayIsFirstDay: true, //set monday as first day of week. Default is false
    // showDay: true,
    eventClick: function(date) {
      var select_date, mm;
      mm = date.month + 1;
      mm = (mm.length == 1) ? "0" + mm : mm;
      select_date = date.year + "-" + mm + "-" + date.day;
      $scope.getEvents("day", select_date);
    },
    dateClick: function(date) {
      var select_date, mm;
      mm = date.month + 1;
      mm = (mm.length == 1) ? "0" + mm : mm;
      select_date = date.year + "-" + mm + "-" + date.day;
      $scope.getEvents("day", select_date);
    },
    changeMonth: function(month, year) {
      var MONTHS = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
      var currMonth = MONTHS.indexOf(month.name);
      var select_date, mm;
      mm = currMonth + 1;
      mm = (mm.length == 1) ? "0" + mm : mm;
      select_date = year + "-" + mm + "-01";
      $scope.getEvents("month", select_date);
    },
  };

  $scope.events = [];

  $scope.eventsLists = [];
  $scope.eventsTitle = "กิจกรรม";
  $scope.getEvents = function(event_view, select_date) {
    $http
      .post(host + 'events/Controller.php', {
        "action": "list",
        "event_view": event_view,
        "select_date": select_date
      })
      .success(function(response) {
        if (response[0].status == "true") {
          $scope.eventsLists = response[0].events;
          if (event_view == "month") {
            $scope.events = response[0].marker;
          }
        } else {
          $scope.eventsLists = [];
        }
      })
      .error(function(error) {
        $scope.item = '{"status" : false , "msg_desc" : "' + error + '"}';
      });
  }

  // $scope.event_view = "month";
  // $scope.event_style = "height:100%;";
  // $scope.options.showDay = false;
  $scope.event_view = "day";
  $scope.event_style = "max-height:200px;";
  $scope.options.showDay = true;

  $scope.changeView = function() {
    if ($scope.event_view == "month") {
      $scope.event_view = "day";
      $scope.event_style = "max-height:200px;";
    } else {
      $scope.event_view = "month";
      $scope.event_style = "height:100%;";
    }
    $scope.options.showDay = !$scope.options.showDay
  }
})
