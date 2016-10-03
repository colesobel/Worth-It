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


  //   if (this.spendPercentage > this.gaugeMax) {
  //   this.gaugeMax = this.spendPercentage
  // }
  //
  // if (this.spendPercentage == 0) {
  //   this.spendPercentage = 0.01
  // }
  // getColor.saySomething('hello from getColor service')
  // // let color = getColor.getColor(this.spendPercentage/ this.gaugeMax)
  //
  //
  // var opts = {
  // lines: 12, // The number of lines to draw
  // angle: 0.0, // The length of each line
  // lineWidth: 0.44, // The line thickness
  // pointer: {
  //   length: 0.6, // The radius of the inner circle
  //   strokeWidth: 0.035, // The rotation offset
  //   color: '#000000' // Fill color
  // },
  // limitMax: 'true',   // If true, the pointer will not go past the end of the gauge
  // colorStart: color,   // Colors
  // colorStop: color,    // just experiment with them
  // strokeColor: '#E0E0E0',   // to see which ones work best for you
  // generateGradient: true
  // };
  // let target = document.getElementsByClassName('gauge')[this.nodeId]
  // var gauge = new Gauge(target).setOptions(opts); // create sexy gauge!
  //
  //
  // gauge.maxValue = this.gaugeMax; // set max gauge value
  // gauge.animationSpeed = 32; // set animation speed (32 is default value)
  // gauge.set(this.spendPercentage); // set actual value



  getDaysInMonth = () => {
    let year = new Date().getFullYear()
    let month = new Date().getMonth()
    home.dayOfMonth = new Date().getDate()
    home.daysInMonth = Date.getDaysInMonth(year, month)
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
      return cat
    })
    console.log(home.gaugeStats);
  })
}

getGaugeStats()

}])
