angular.module('myApp.settingsController', [])

.controller('settingsController', ['$http', '$state', '$rootScope', function($http, $state, $rootScope) {
  let user_id = Number(localStorage.getItem('user_id'))
  let settings = this
  settings.expenseCategories = []
  settings.selectedTab = 'expenseCategories'
  settings.percentageTotal
  settings.noIncomeData = false
  settings.editingIncome = false
  settings.fixedExpenses = []
  settings.fixedExpenseInputs = [1]

  settings.selectTab = (li, name) => {
    let tabs = document.getElementsByTagName('li')
    for(let i = 0; i < tabs.length; i++) {
      tabs[i].className = ''
    }
    li = document.getElementById(li)
    li.className = 'selected'
    settings.selectedTab = name
  }

  function getPercentageTotal() {
    let total = 0
    settings.expenseCategories.forEach(cat => total += Number(cat['percentage']))
    settings.percentageTotal = total
  }
  getExpenseCategories = () => {
    $http.post('http://localhost:3000/accountSettings/getExpenseCategories', {user_id}).then(categories => {
      settings.expenseCategories = categories.data.map(cat => {
        return {
          catId: cat.id,
          expense_category: cat.expense_category,
          percentage: cat.percentage,
          isEditing: false
        }
      })
      getPercentageTotal()
    })
  }
  getExpenseCategories()

  settings.submitTempExpenses = (i, id) => {
  settings.expenseCategories.forEach(cat => {
    if (cat['catId'] == id) {
      cat['expense_category'] = document.getElementById(i + 'expCat')['value']
      cat['percentage'] = document.getElementById(i + 'percentage')['value']
    }
  })
  getPercentageTotal()
}


  settings.addCategory = (cat) => {
    cat = document.getElementById(cat)
    settings.expenseCategories.push({
      id: cat,
      expense_category: cat.value.toLowerCase(),
      percentage: 0,
      isEditing: false
    })
    console.log(settings.expenseCategories);
  }

  settings.deleteCategory = (catId) => {
    console.log(catId);
    for(let i = 0; i < settings.expenseCategories.length; i++) {
      if (settings.expenseCategories[i]['catId'] == catId) {
        settings.expenseCategories.splice(i, 1)
      }
    }
    getPercentageTotal()
  }

  settings.submitExpensesToDatabase = () => {
    let total = 0
    settings.expenseCategories.forEach(cat => total += Number(cat['percentage']))
    if (total === 100) {
      $http.post('http://localhost:3000/accountSettings/updateExpenseCategories', {user_id, expenseCategories: settings.expenseCategories}).then(data => {
        console.log(data.data)
      })
    } else {
      console.log('you suck at math')
    }
  }

  getMonthlyIncome = () => {
    $http.post('http://localhost:3000/accountSettings/getIncome', {user_id}).then(income => {
      console.log(income.data);
      if (income.data) {
        settings.userIncome = income.data
        settings.noIncomeData = false
      } else {
        settings.noIncomeData = true
      }
      console.log(this.noIncomeData);
    })
  }
  getMonthlyIncome()

  settings.editIncome = (updatedIncome) => {
    let income = document.getElementById('updatedIncome')['value']
    $http.post('http://localhost:3000/accountSettings/updateIncome', {user_id, income}).then(income => {
      settings.userIncome = income.data
      settings.editingIncome = false
    })
  }

  settings.submitIncome = (income) => {
    income = document.getElementById(income).value
    $http.post('http://localhost:3000/accountSettings/enterIncome', {user_id, income}).then(data => {
      getMonthlyIncome()
    })
  }

  getFixedExpenses = () => {
    $http.post('http://localhost:3000/accountSettings/getFixedExpenses', {user_id}).then(data => {
      settings.fixedExpenses = data.data
      console.log(settings.fixedExpenses);

    })
  }
  getFixedExpenses()

  settings.addFixedExpense = () => {
    let num = settings.fixedExpenseInputs[settings.fixedExpenseInputs.length - 1] + 1
    settings.fixedExpenseInputs.push(num)
  }

  settings.submitFixedExpnses = () => {
    let expenseItems = document.getElementsByClassName('fixed-expense-container')
    let expenseObj = {}
    for(let i = 0; i < expenseItems.length; i++) {
      expenseObj[i] = {}
      expenseObj[i].expenseCategory = expenseItems[i]['children'][1]['value'].toLowerCase()
      expenseObj[i].amount = expenseItems[i]['children'][2]['value']
    }
    $http.post('http://localhost:3000/accountSettings/addFixedExpenses', {user_id, fixed_expenses: expenseObj}).then(data => {
      getFixedExpenses()
      settings.fixedExpenseInputs = [1]
    })
  }


}])
