angular.module('myApp.categoryDetailController', [])


.controller('categoryDetailController', ['$http', '$state', '$stateParams', '$scope', 'getDate', function($http, $state, $stateParams, $scope, getDate) {
  let user_id = Number(localStorage.getItem('user_id'))
  if (!user_id) $state.go('login')
  let cd = this
  cd.userId = user_id
  cd.selectedTab='spendingDetail'
  cd.categoryName = $stateParams.categoryName
  cd.year = new Date().getFullYear()
  let staticYear = new Date().getFullYear()
  let month = new Date().getMonth()
  let staticMonth = new Date().getMonth()
  cd.dayOfMonth = new Date().getDate()
  cd.daysInMonth = Date.getDaysInMonth(cd.year, month)
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
    getCategoryStats()
    cd.futureRequest = false
  }

  // function getCategoryStats() {
  //   $http.post('http://localhost:3000/categoryDetail/getCategoryStats', {user_id, currentMonth: cd.currentMonth, category: cd.categoryName}).then((data) => {
  //     data.data = data.data[0]
  //     data.data.allocated_for_budget = (Number(data.data.desired_spend_percentage) / 100) * Number(data.data.monthly_income)
  //     data.data.daily_fixed_expense = data.data.fixed_expense_amount / cd.daysInMonth
  //     data.data.current_fixed_expense_amortized = data.data.daily_fixed_expense * cd.dayOfMonth
  //     data.data.spend_total = Number(data.data.spend_total) + data.data.current_fixed_expense_amortized
  //     data.data.budget_left = data.data.allocated_for_budget - Number(data.data.spend_total)
  //     data.data.spent_percentage = (Number(data.data.spend_total) / data.data.allocated_for_budget * 100).toFixed(2)
  //     data.data.budget_left_percentage = (data.data.budget_left / data.data.allocated_for_budget * 100).toFixed(2)
  //     data.data.percentage_spent = Number((data.data.spend_total / data.data.allocated_for_budget * 100).toFixed())
  //     data.data.daily_spending = data.data.spend_total / cd.dayOfMonth
  //     data.data.desired_daily_spending = data.data.allocated_for_budget / cd.daysInMonth
  //     data.data.surplus_deficit = data.data.daily_spending - data.data.desired_daily_spending
  //     console.log(data.data);
  //     cd.statDetail = data.data
  //     console.log(cd.statDetail.surplus_deficit >= 0);
  //   })
  // }
  // getCategoryStats()

  getGaugeStats = () => {
    $http.post('http://localhost:3000/dailyExpenses/getGaugeStats', {user_id, currentMonth: cd.currentMonth}).then(gaugeStats => {
      cd.gaugeStats = gaugeStats.data.map(cat => {
        cat.allocated_for_budget = (Number(cat.desired_spend_percentage) / 100) * Number(cat.monthly_income)
        cat.daily_fixed_expense = cat.fixed_expense_amount / cd.daysInMonth
        cat.current_fixed_expense_amortized = cat.daily_fixed_expense * cd.dayOfMonth
        cat.spend_total = Number(cat.spend_total) + cat.current_fixed_expense_amortized
        cat.budget_left = cat.allocated_for_budget - Number(cat.spend_total)
        cat.spent_percentage = (Number(cat.spend_total) / cat.allocated_for_budget * 100).toFixed(2)
        cat.budget_left_percentage = (cat.budget_left / cat.allocated_for_budget * 100).toFixed(2)
        cat.percentage_spent = Number((cat.spend_total / cat.allocated_for_budget * 100).toFixed())
        cat.daily_spending = cat.spend_total / cd.dayOfMonth
        cat.desired_daily_spending = cat.allocated_for_budget / cd.daysInMonth
        cat.daily_surplus_deficit = cat.daily_spending - cat.desired_daily_spending
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
      cd.savingsData.monthly_saving_percentage_of_budget = Number((cd.savingsData.current_saving / cd.savings.allocated_for_budget * 100).toFixed())
      if (cd.savingsData.monthly_saving_percentage_of_budget > 100) {cd.savingsData.monthly_saving_percentage_of_budget = 100}
      cd.savingsData.savings_to_go_percentage = 100 - cd.savingsData.monthly_saving_percentage_of_budget
      cd.savingsData.desired_spend_percentage = cd.savings.desired_spend_percentage
      // console.log(cd.gaugeStats);
      // console.log(cd.savingsData);
      cd.featuredCategory = cd.gaugeStats.find(cat => cat.expense_category == cd.categoryName)
      console.log(cd.featuredCategory);
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
      console.log(cd.purchaseHistory);
    })
  }
  getPurchaseHistory()


  cd.deletePurchase = (id) => {
    $http.get(`http://localhost:3000/categoryDetail/purchaseHistory/${id}`).then(() => getPurchaseHistory())
  }

  cd.editPurchase = (id) => {
    console.log('editing purchase');
    console.log(id);
  }

  cd.submitEdit = (id) => {

  }



}])
