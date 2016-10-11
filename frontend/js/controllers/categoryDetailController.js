angular.module('myApp.categoryDetailController', [])


.controller('categoryDetailController', ['$http', '$state', '$stateParams', '$scope', 'getDate', function($http, $state, $stateParams, $scope, getDate) {
  let user_id = Number(localStorage.getItem('user_id'))
  if (!user_id) $state.go('login')
  let cd = this
  cd.userId = user_id
  cd.selectedTab='spendingDetail'
  cd.categoryName = $stateParams.categoryName
  if (cd.categoryName === 'savings') cd.savingsShowing = true
  cd.year = new Date().getFullYear()
  let staticYear = new Date().getFullYear()
  let month = new Date().getMonth()
  let staticMonth = new Date().getMonth()
  cd.dayOfMonth = new Date().getDate()
  cd.daysInMonth = Date.getDaysInMonth(cd.year, month)
  cd.monthCompletion = ((cd.dayOfMonth / cd.daysInMonth) * 100).toFixed()
  cd.currentMonth = getDate.getMonthName(month)
  cd.changeCurrentMonth = inc => {
    if (month === 11 && inc > 0) {
      month = 0
      cd.year += 1
    } else if (month === 0 && inc < 0){
      month = 11
      cd.year -= 1
    } else {
      month += inc
    }
    cd.currentMonth = getDate.getMonthName(month)
    if (month > staticMonth && cd.year >= staticYear) {
      cd.futureRequest = true
      cd.purchaseHistory = []
      return
    }
    getPurchaseHistory()
    getGaugeStats()
    cd.futureRequest = false
  }

  getGaugeStats = () => {
    $http.post('http://localhost:3000/dailyExpenses/getGaugeStats', {user_id, currentMonth: cd.currentMonth, year: cd.year}).then(gaugeStats => {
      console.log(gaugeStats.data);
      cd.gaugeStats = gaugeStats.data.map(cat => {
        cat.allocated_for_budget = (Number(cat.desired_spend_percentage) / 100) * Number(cat.monthly_income)
        cat.daily_fixed_expense = cat.fixed_expense_amount / cd.daysInMonth
        cat.current_fixed_expense_amortized = cat.daily_fixed_expense * cd.dayOfMonth
        cat.spend_total = Number(cat.spend_total) + cat.current_fixed_expense_amortized
        cat.budget_left = cat.allocated_for_budget - Number(cat.spend_total)
        cat.spent_percentage = (Number(cat.spend_total) / cat.allocated_for_budget * 100).toFixed()
        cat.budget_left_percentage = (cat.budget_left / cat.allocated_for_budget * 100).toFixed()
        cat.percentage_spent = Number((cat.spend_total / cat.allocated_for_budget * 100).toFixed())
        cat.daily_spending = cat.spend_total / cd.dayOfMonth
        cat.desired_daily_spending = cat.allocated_for_budget / cd.daysInMonth
        cat.daily_surplus_deficit = cat.daily_spending - cat.desired_daily_spending
        cat.daily_incremental_spending = cat.daily_spending - cat.daily_fixed_expense
        cat.incremental_spending_percentage = Number(((cat.daily_incremental_spending / cat.daily_spending) * 100).toFixed())
        if (isNaN(cat.incremental_spending_percentage)) cat.incremental_spending_percentage = 0
        cat.fixed_expense_percentage = Number((100 - cat.incremental_spending_percentage).toFixed())
        if (cat.daily_fixed_expense === 0) cat.fixed_expense_percentage = 0
        return cat
      })
      cd.savings = cd.gaugeStats.find((cat) => cat.expense_category == 'savings')
      cd.gaugeStats = cd.gaugeStats.filter(cat => cat.expense_category !== 'savings')
      let currentSpending = cd.gaugeStats.reduce((total, elem) => {
        return total += elem.spend_total
      }, 0)
      cd.savingsData = {}
      cd.savingsData.current_spending = currentSpending
      cd.gaugeStats = cd.gaugeStats.map(cat => {
        cat.spend_percentage = Number((cat.spend_total / cd.savingsData.current_spending * 100).toFixed())
        return cat
      })
      cd.savingsData.expense_category = 'savings'
      cd.savingsData.desired_daily_saving = cd.savings.allocated_for_budget / cd.daysInMonth
      cd.savingsData.desired_daily_spending = (cd.savings.monthly_income - cd.savings.allocated_for_budget) / cd.daysInMonth
      cd.savingsData.current_daily_spending = cd.savingsData.current_spending / cd.dayOfMonth
      cd.savingsData.daily_income = cd.savings.monthly_income / cd.daysInMonth
      cd.savingsData.current_daily_saving = cd.savingsData.daily_income - cd.savingsData.current_daily_spending
      cd.savingsData.current_saving = cd.savingsData.current_daily_saving * cd.dayOfMonth
      cd.savingsData.current_saving_percentage = (Number(cd.savingsData.current_daily_saving / cd.savingsData.daily_income * 100).toFixed())
      cd.savingsData.current_spending_percentage = 100 - cd.savingsData.current_saving_percentage
      if (cd.savingsData.current_daily_spending === 0) cd.savingsData.current_spending_percentage = 0
      cd.savingsData.monthly_saving_percentage_of_budget = Number((cd.savingsData.current_saving / cd.savings.allocated_for_budget * 100).toFixed())
      if (cd.savingsData.monthly_saving_percentage_of_budget > 100) {cd.savingsData.monthly_saving_percentage_of_budget = 100}
      cd.savingsData.savings_to_go_percentage = 100 - cd.savingsData.monthly_saving_percentage_of_budget
      cd.savingsData.desired_monthly_percentage = cd.savings.desired_spend_percentage
      cd.savingsData.desired_month_spend_percentage = 100 - cd.savingsData.desired_monthly_percentage
      cd.savingsData.additional_savings_to_meet_target = cd.savings.allocated_for_budget - cd.savingsData.current_saving
      if (cd.savingsData.additional_savings_to_meet_target < 0) cd.savingsData.additional_savings_to_meet_target = 0
      cd.savingsData.current_monthly_spending = cd.savingsData.current_daily_spending * cd.dayOfMonth
      cd.savingsData.current_monthly_income = cd.savingsData.daily_income * cd.dayOfMonth
      cd.savingsData.desired_monthly_spending = cd.savingsData.desired_daily_spending * cd.daysInMonth
      cd.savingsData.total_current_fixed_expense = cd.gaugeStats.reduce((total, elem) => {
        return total += elem.daily_fixed_expense
      }, 0) * cd.dayOfMonth
      cd.savingsData.total_current_incremental_expense = cd.savingsData.current_monthly_spending - cd.savingsData.total_current_fixed_expense
      cd.savingsData.total_current_fixed_expense_percentage = Number(((cd.savingsData.total_current_fixed_expense / cd.savingsData.current_monthly_spending) * 100).toFixed())
      cd.savingsData.total_current_incremental_expense_percentage = Number(((cd.savingsData.total_current_incremental_expense / cd.savingsData.current_monthly_spending) * 100).toFixed())

      cd.featuredCategory = cd.gaugeStats.find(cat => cat.expense_category == cd.categoryName) || cd.savings
      cd.savingsDataReady = true
    })
  }

  getGaugeStats()

  cd.selectTab = (li, name) => {
    let tabs = document.getElementsByClassName('cd-tab')
    for(let i = 0; i < tabs.length; i++) {
      tabs[i].className = 'cd-tab'
    }
    li = document.getElementById(li)
    li.className += ' selected'
    cd.selectedTab = name
  }

  function getPurchaseHistory() {
    $http.post('http://localhost:3000/categoryDetail/getPurchaseHistory', {user_id, currentMonth: cd.currentMonth, category: cd.categoryName}).then(purchaseHistory => {
      cd.purchaseHistory = purchaseHistory.data.map(his => {
        his.isEditing = false
        return his
      })
    })
  }
  getPurchaseHistory()


  cd.deletePurchase = (id) => {
    $http.get(`http://localhost:3000/categoryDetail/purchaseHistory/${id}`).then(() => getPurchaseHistory())
  }

  cd.editPurchase = (id) => {
    cd.purchaseHistory.find(elem => elem.id === id).isEditing = true
  }

  cd.submitEdit = (id, index) => {
    let purchaseObj = {}
    purchaseObj.id = id
    purchaseObj.user_id = user_id
    purchaseObj.expense_amount = document.getElementById(index + 'amount').value
    if (purchaseObj.expense_amount == 0) purchaseObj.expense_amount = 1
    purchaseObj.expense_category = cd.categoryName
    purchaseObj.memo = document.getElementById(index + 'memo').value
    purchaseObj.full_date = document.getElementById(index + 'date').value
    purchaseObj.day = getDate.getDayName(new Date(purchaseObj.full_date).getDay())
    purchaseObj.month = getDate.getMonthName(new Date(purchaseObj.full_date).getMonth())
    purchaseObj.year = new Date(purchaseObj.full_date).getFullYear()
    purchaseObj.unix_timestamp = new Date(purchaseObj.full_date).getTime()
    $http.post('http://localhost:3000/categoryDetail/updatePurchase', purchaseObj).then(() => {
      getPurchaseHistory()
    })

  }


  cd.dayFilterFun = function (expense) {
  if (!cd.dayFilter) {
    return true
  } else {
    if (expense.day.toLowerCase().includes(cd.dayFilter.toLowerCase())) {
      return true
    }
  }
  return false
}



}])
