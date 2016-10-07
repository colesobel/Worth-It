angular.module('myApp.homeController', ['myApp.services'])

.controller('homeController', ['$http', '$state', '$rootScope', 'getColor', 'getDate', function($http, $state, $rootScope, getColor, getDate) {
  let user_id = Number(localStorage.getItem('user_id'))
  if (!user_id) $state.go('login')
  let home = this
  home.userId = user_id
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
      if (gaugeStats.data[0].monthly_income === null) {
        home.noIncomeData = true
        return
      }
      console.log(gaugeStats.data);
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
      let currentSpending = home.gaugeStats.reduce((total, elem) => {
        return total += elem.spend_total
      }, 0)
      home.savingsData = {}
      home.savingsData.current_spending = currentSpending
      home.gaugeStats = home.gaugeStats.map(cat => {
        cat.spend_percentage = Number((cat.spend_total / home.savingsData.current_spending * 100).toFixed())
        if (isNaN(cat.spend_percentage)) cat.spend_percentage = 0
        return cat
      })
      home.savingsData.expense_category = 'savings'
      home.savingsData.desired_daily_saving = home.savings.allocated_for_budget / home.daysInMonth
      home.savingsData.desired_daily_spending = (home.savings.monthly_income - home.savings.allocated_for_budget) / home.daysInMonth
      home.savingsData.current_daily_spending = home.savingsData.current_spending / home.dayOfMonth
      home.savingsData.daily_income = home.savings.monthly_income / home.daysInMonth
      home.savingsData.current_daily_saving = home.savingsData.daily_income - home.savingsData.current_daily_spending
      home.savingsData.current_saving = home.savingsData.current_daily_saving * home.dayOfMonth
      home.savingsData.current_saving_percentage = (Number(home.savingsData.current_daily_saving / home.savingsData.daily_income * 100).toFixed())
      home.savingsData.monthly_saving_percentage_of_budget = Number((home.savingsData.current_saving / home.savings.allocated_for_budget * 100).toFixed())
      if (home.savingsData.monthly_saving_percentage_of_budget > 100) {home.savingsData.monthly_saving_percentage_of_budget = 100}
      home.savingsData.savings_to_go_percentage = 100 - home.savingsData.monthly_saving_percentage_of_budget
      home.savingsData.desired_spend_percentage = home.savings.desired_spend_percentage
      home.savingsDataReady = true
      function sorter(a, b) {
        if (a.desired_spend_percentage < b.desired_spend_percentage) return -1;
        if (a.desired_spend_percentage > b.desired_spend_percentage) return 1;
        return 0;
      }
      home.gaugeStats.sort(sorter).reverse()
      createSpendCategoryBar()
      createDailySpendingBar()
    })
  }

  getGaugeStats()


  getDailyAverages = () => {
    $http.post('http://localhost:3000/dailyExpenses/getDailyAverages', {user_id, currentMonth: home.monthName}).then(avgs => {
      console.log(avgs);
    })
  }

  getDailyAverages()

  let dayObj = {
    'Monday': 0,
    'Tuesday': 0,
    'Wednesday': 0,
    'Thursday': 0,
    'Friday': 0,
    'Saturday': 0,
    'Sunday': 0
  }


  function createSpendCategoryBar() {
    home.finalCategoryBarData = []
    let categoryBarObj = home.gaugeStats.reduce((obj, elem) =>{
      obj[elem.expense_category] = elem.spend_total
      return obj
    }, {})
    for (let exp in categoryBarObj) {

      home.finalCategoryBarData.push([exp, Number(categoryBarObj[exp].toFixed()), '#14ED14'])
    }
    function Comparator(a, b) {
      if (a[1] < b[1]) return -1;
      if (a[1] > b[1]) return 1;
      return 0;
    }
    home.finalCategoryBarData.sort(Comparator).reverse()
    home.finalCategoryBarData.push(['savings', home.savingsData.current_saving, '#14ED14'])
    home.finalCategoryBarData.unshift(['Expense Category', '$', {role: 'style'}])
    home.barChartReady = true
  }

  function createDailySpendingBar() {
    home.dailySpendingBarData = []

    home.dailySpendingBarData.push(['Daily Net Income', Number(home.savingsData.daily_income.toFixed()), '#14ED14'])
    home.dailySpendingBarData.push(['Daily Spending', Number(home.savingsData.current_daily_spending.toFixed()), '#14ED14'])
    home.dailySpendingBarData.push(['Daily Savings', Number(home.savingsData.current_daily_saving.toFixed()), '#14ED14'])
    home.dailySpendingBarData.unshift(['Savings/Spending', '$', {role: 'style'}])
    home.dailySpendingBarReady = true
  }




}])
