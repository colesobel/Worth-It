angular.module('myApp.services', [])

.service('getColor', function() {
  this.saySomething = function(something) {
    console.log(something);
  }
})
