angular.module('myApp.homeController', ['myApp.services'])

.controller('homeController', ['$http', '$state', '$rootScope', 'getColor', function($http, $state, $rootScope, getColor) {
  let user_id = Number(localStorage.getItem('user_id'))
  let home = this
  getUserInfo()

  function getUserInfo() {
    $http.post('http://localhost:3000/login/getUserInfo', {user_id}).then(name => {
      home.fullName = name.data.first_name + ' ' + name.data.last_name
    })

  }


  getDaysInMonth = () => {
    let year = new Date().getFullYear()
    let month = new Date().getMonth()
    home.dayOfMonth = new Date().getDate()
    home.daysInMonth = Date.getDaysInMonth(year, month)
    home.daysPassedPercentage = home.dayOfMonth / home.daysInMonth * 100
    home.daysLeftPercentage =100 - home.daysPassedPercentage
  }
  getDaysInMonth()


getGaugeStats = () => {
  $http.post('http://localhost:3000/dailyExpenses/getGaugeStats', {user_id}).then(gaugeStats => {
    home.gaugeStats = gaugeStats.data.map(cat => {
      cat.allocated_for_budget = (Number(cat.desired_spend_percentage) / 100) * Number(cat.monthly_income)
      cat.daily_fixed_expense = cat.fixed_expense_amount / home.daysInMonth
      cat.current_fixed_expense_amortized = cat.daily_fixed_expense * this.dayOfMonth
      cat.spend_total = Number(cat.spend_total) + cat.current_fixed_expense_amortized
      cat.budget_left = cat.allocated_for_budget - Number(cat.spend_total)
      cat.spent_percentage = (Number(cat.spend_total) / cat.allocated_for_budget * 100).toFixed(2)
      cat.budget_left_percentage = (cat.budget_left / cat.allocated_for_budget * 100).toFixed(2)
      cat.percentage_spent = Number((cat.spend_total / cat.allocated_for_budget * 100).toFixed())
      cat.max_gauge = cat.gauge_max
      console.log(cat);
      return cat
    })
  })
}

getGaugeStats()


}])
