angular.module('myApp.addExpenseController', [])


.controller('addExpenseController', ['$http', '$state', '$rootScope', function($http, $state, $rootScope) {
  let user_id = Number(localStorage.getItem('user_id'))
  let addExpense = this
  addExpense.dateString = new Date().toISOString().substring(0, 10)
  addExpense.expenses = [1]

  addExpense.addAnExpense = () => {
    let num = addExpense.expenses[addExpense.expenses.length - 1] + 1
    addExpense.expenses.push(num)
  }

  getExpenseCategories = () => {
  $http.post('http://localhost:3000/accountSettings/getExpenseCategories', {user_id}).then(categories => {
    addExpense.expenseCategories = categories.data
  })
}
getExpenseCategories()

}])
