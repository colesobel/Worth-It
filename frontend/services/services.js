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
