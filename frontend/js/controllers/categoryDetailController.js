angular.module('myApp.categoryDetailController', [])


.controller('categoryDetailController', ['$http', '$state', '$stateParams', '$scope', 'getDate', function($http, $state, $stateParams, $scope, getDate) {
  let user_id = Number(localStorage.getItem('user_id'))
  let cd = this
  cd.categoryName = $stateParams.categoryName
  let year = new Date().getFullYear()
  let month = new Date().getMonth()
  cd.dayOfMonth = new Date().getDate()
  cd.daysInMonth = Date.getDaysInMonth(year, month)
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
    getCategoryStats()
  }

  function getCategoryStats() {
    $http.post('http://localhost:3000/categoryDetail/getCategoryStats', {user_id, currentMonth: cd.currentMonth, category: cd.categoryName}).then((data) => {
      data.data = data.data[0]
      data.data.allocated_for_budget = (Number(data.data.desired_spend_percentage) / 100) //* Number(data.data.monthly_income)
      data.data.daily_fixed_expense = data.data.fixed_expense_amount / cd.daysInMonth
      data.data.current_fixed_expense_amortized = data.data.daily_fixed_expense * cd.dayOfMonth
      data.data.spend_total = Number(data.data.spend_total) + data.data.current_fixed_expense_amortized
      data.data.budget_left = data.data.allocated_for_budget - Number(data.data.spend_total)
      data.data.spent_percentage = (Number(data.data.spend_total) / data.data.allocated_for_budget * 100).toFixed(2)
      data.data.budget_left_percentage = (data.data.budget_left / data.data.allocated_for_budget * 100).toFixed(2)
      data.data.percentage_spent = Number((data.data.spend_total / data.data.allocated_for_budget * 100).toFixed())
      console.log(data.data);
    })
  }
  getCategoryStats()

  cd.selectTab = (li, name) => {
    let tabs = document.getElementsByClassName('cd-tab')
    console.log(tabs);
    for(let i = 0; i < tabs.length; i++) {
      tabs[i].className = 'cd-tab'
    }
    li = document.getElementById(li)
    li.className += ' selected'
    cd.selectedTab = name
  }

  function getPurchaseHistory() {
    $http.post('http://localhost:3000/categoryDetail/getPurchaseHistory', {user_id, currentMonth: cd.currentMonth, category: cd.categoryName}).then(purchaseHistory => {
      console.log(purchaseHistory.data);
      cd.purchaseHistory = purchaseHistory.data
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
