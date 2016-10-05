angular.module('myApp.filters', [])

.filter('percentage', function () {
  return input => {
    return input < 1 ? 0 + '%' : input + '%'
  }
})

.filter('dollar', function() {
  return input => '$' + Number(input.toFixed())
})


.filter('capitalize', function() {
  return input => {
    return input.split(' ').reduce((expense, word) => {
      let uppercase = word[0].toUpperCase()
      word = word.split('')
      word.splice(0, 1, uppercase).join('')
      expense.push(word.join(''))
      return expense
    }, []).join(' ')
  }
})
