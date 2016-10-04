angular.module('myApp.filters', [])

.filter('percentage', function () {
  return input => input + '%'
})

.filter('dollar', function() {
  return input => '$' + Number(input.toFixed())
})
