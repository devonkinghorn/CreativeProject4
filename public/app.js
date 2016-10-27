var app = window.angular.module('app', [])
app.controller('mainCtrl', mainCtrl)

function mainCtrl($scope, $http) {
  console.log('loaded');
  $scope.classes = [];
  $scope.addClass = function () {
    if ($scope.formClassNumber && $scope.formClassNumber) {
      $scope.classes.push({
        department: $scope.formDepartment,
        classNumber: $scope.formClassNumber
      })
      $scope.formClassNumber = '';
    }

    console.log('adding')
  }
  $scope.schedules = [];
  $scope.viewIndex = 0;
  $scope.getClasses = function () {
    $http({
      url: '/api/desiredclasses',
      method: "GET",
      params: { classes: JSON.stringify($scope.classes) }
    })
      .then(function(res) {
        console.log(res);
         $scope.schedules = res.data;
         $scope.viewIndex = 0;
      });
    console.log('getting classes')
  }
  $scope.changeSchedule = function(direction){
    if($scope.viewIndex + direction >= 0 && $scope.viewIndex + direction < $scope.schedules.length)
      $scope.viewIndex += direction;
  }
}
