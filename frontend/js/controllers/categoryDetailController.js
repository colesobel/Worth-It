angular.module('myApp.categoryDetailController', [])


.controller('categoryDetailController', ['$http', '$state', '$stateParams', '$scope', 'getDate', function($http, $state, $stateParams, $scope, getDate) {
  let user_id = Number(localStorage.getItem('user_id'))
  let cd = this
  cd.categoryName = $stateParams.categoryName
  let year = new Date().getFullYear()
  let month = new Date().getMonth()
  cd.currentMonth = getDate.getMonthName(month)
  cd.changeCurrentMonth = inc => {
    if (month === 11 && inc > 0) {
      month = 0
    } else if (month === 0 && inc < 0){
      month = 11
    } else {
      month += inc
    }
    cd.currentMonth = getDate.getMonthName(month)
  }

  function getCategoryStats() {
    $http.post('http://localhost:3000/categoryDetail/getCategoryStats', {user_id, currentMonth: cd.currentMonth}).then((data) => {
      console.log(data.data);
    })
  }
  getCategoryStats()



}])
