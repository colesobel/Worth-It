angular.module('myApp.services', [])

.service('getColor', function() {
  this.getColor = function(value) {
    if (value >= 0 && value <= 0.25) {
      return '#14ED14'
    } else if (value > 0.25 && value <= 0.50) {
      return '#ffff16'
    } else if (value > 0.50 && value <= 0.75) {
      return '#FF9200'
    } else {
      return '#FB1C16'
    }
  }
})

.service('getDate', function() {
  this.getDayName = function(num) {
    let days = {
      0: 'Monday',
      1: 'Tuesday',
      2: 'Wednesday',
      3: 'Thursday',
      4: 'Friday',
      5: 'Saturday',
      6: 'Sunday'
    }
    return days[num]
  }

  this.getMonthName = function(num) {
    let months = {
      0: 'January',
      1: 'February',
      2: 'March',
      3: 'April',
      4: 'May',
      5: 'June',
      6: 'July',
      7: 'August',
      8: 'September',
      9: 'October',
      10: 'November',
      11: 'December'
    }
    return months[num]
  }
})
