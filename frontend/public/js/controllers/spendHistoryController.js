angular.module('myApp.spendHistoryController', [])


.controller('spendHistoryController', ['$http', '$state', '$rootScope', 'getDate', function($http, $state, $rootScope, getDate) {
  let user_id = Number(localStorage.getItem('user_id'))
  let sh = this
  sh.userId = user_id

  $http.get('https://whispering-shelf-88050.herokuapp.com/dailyExpenses/getAll/' + user_id).then(history => {
    console.log(history.data);
    sh.history = history.data
  })

  sh.dayFilterFun = function (expense) {
  if (!sh.dayFilter) {
    return true
  } else {
    if (expense.day.toLowerCase().includes(sh.dayFilter.toLowerCase())) {
      return true
    }
  }
  return false
}
  sh.monthFilterFun = function (expense) {
  if (!sh.monthFilter) {
    return true
  } else {
    if (expense.month.toLowerCase().includes(sh.monthFilter.toLowerCase())) {
      return true
    }
  }
  return false
}
  sh.memoFilterFun = function (expense) {
  if (!sh.memoFilter) {
    return true
  } else {
    if (expense.memo.toLowerCase().includes(sh.memoFilter.toLowerCase())) {
      return true
    }
  }
  return false
}
  sh.yearFilterFun = function (expense) {
  if (!sh.yearFilter) {
    return true
  } else {
    if (expense.year.toString().includes(sh.yearFilter.toString())) {
      return true
    }
  }
  return false
}

}])
