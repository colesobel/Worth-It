angular.module('myApp.navDirective', [])


.directive('navbar',['getColor', function(getColor) {
  return {
    restrict: 'E',
    templateUrl: '/partials/navbar.html',
    scope: {
      userId: '='
    },
    controller: function($scope, $http) {
      console.log($scope.userId);
      $http.post('http://localhost:3000/login/getUserInfo', {user_id: $scope.userId}).then(name => {
        $scope.name = name.data.first_name + ' ' + name.data.last_name
      })
    }
  }
}])
