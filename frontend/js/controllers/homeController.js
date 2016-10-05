angular.module('myApp.homeController', ['myApp.services'])

.controller('homeController', ['$http', '$state', '$rootScope', 'getColor', 'getDate', function($http, $state, $rootScope, getColor, getDate) {
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
    home.monthName = getDate.getMonthName(month)
  }
  getDaysInMonth()


getGaugeStats = () => {
  $http.post('http://localhost:3000/dailyExpenses/getGaugeStats', {user_id, currentMonth: home.monthName}).then(gaugeStats => {
    home.gaugeStats = gaugeStats.data.map(cat => {
      cat.allocated_for_budget = (Number(cat.desired_spend_percentage) / 100) * Number(cat.monthly_income)
      cat.daily_fixed_expense = cat.fixed_expense_amount / home.daysInMonth
      cat.current_fixed_expense_amortized = cat.daily_fixed_expense * home.dayOfMonth
      cat.spend_total = Number(cat.spend_total) + cat.current_fixed_expense_amortized
      cat.budget_left = cat.allocated_for_budget - Number(cat.spend_total)
      cat.spent_percentage = (Number(cat.spend_total) / cat.allocated_for_budget * 100).toFixed(2)
      cat.budget_left_percentage = (cat.budget_left / cat.allocated_for_budget * 100).toFixed(2)
      cat.percentage_spent = Number((cat.spend_total / cat.allocated_for_budget * 100).toFixed())
      cat.max_gauge = cat.gauge_max
      return cat
    })
    home.savings = home.gaugeStats.find((cat) => cat.expense_category == 'savings')
    home.gaugeStats = home.gaugeStats.filter(cat => cat.expense_category !== 'savings')
    home.savingsData = home.gaugeStats.reduce((obj, elem) => {
      obj.current_spending = obj.current_spending + elem.spend_total || 0
      return obj
    }, {})
    home.savingsData.expense_category = 'savings'
    home.savingsData.desired_daily_saving = home.savings.allocated_for_budget / home.daysInMonth
    home.savingsData.desired_daily_spending = (home.savings.monthly_income - home.savings.allocated_for_budget) / home.daysInMonth
    home.savingsData.current_daily_spending = home.savingsData.current_spending / home.dayOfMonth
    home.savingsData.daily_income = home.savings.monthly_income / home.daysInMonth
    home.savingsData.current_daily_saving = home.savingsData.daily_income - home.savingsData.current_daily_spending
    home.savingsData.current_saving = home.savingsData.current_daily_saving * home.dayOfMonth
    home.savingsData.current_saving_percentage = (Number(home.savingsData.current_daily_saving / home.savingsData.daily_income * 100).toFixed())
    home.savingsData.monthly_saving_percentage_of_budget = home.savingsData.current_saving / home.savings.allocated_for_budget * 100
    if (home.savingsData.monthly_saving_percentage_of_budget > 100) {home.savingsData.monthly_saving_percentage_of_budget = 100}
    home.savingsData.savings_to_go_percentage = 100 - home.savingsData.monthly_saving_percentage_of_budget
    home.savingsData.desired_spend_percentage = home.savings.desired_spend_percentage
    console.log(home.savingsData);
    console.log(home.gaugeStats);
    console.log(home.savings);
    home.savingsDataReady = true
  })
}

getGaugeStats()


}])
