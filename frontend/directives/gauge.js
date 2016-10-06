angular.module('myApp.gaugeDirective', [])

.directive('gauge',['getColor', function(getColor) {
  return {
    restrict: 'E',
    template: '<canvas class="gauge" id="foo"></canvas>',
    scope: {
      nodeIndex: '=',
      gaugeStats: '='
    },
    controller: function($scope) {
      if ($scope.gaugeStats.expense_category === 'savings') {
        $scope.gaugeStats.max_gauge = Number($scope.gaugeStats.desired_spend_percentage * 2)
        $scope.gaugeStats.spend_percentage = Number($scope.gaugeStats.current_saving_percentage)
      }

      $scope.gaugeStats.gauge_max = Number($scope.gaugeStats.gauge_max)
      if ($scope.gaugeStats.spend_percentage > Number($scope.gaugeStats.max_gauge)) {
        $scope.gaugeStats.max_gauge = $scope.gaugeStats.spend_percentage
      }

      if ($scope.gaugeStats.spend_percentage <= 0) {$scope.gaugeStats.spend_percentage = 0.01}


      let color = getColor.getColor($scope.gaugeStats.spend_percentage / Number($scope.gaugeStats.max_gauge))


      var opts = {
        lines: 12, // The number of lines to draw
        angle: 0.0, // The length of each line
        lineWidth: 0.44, // The line thickness
        pointer: {
          length: 0.6, // The radius of the inner circle
          strokeWidth: 0.035, // The rotation offset
          color: '#000000' // Fill color
        },
        limitMax: 'true',   // If true, the pointer will not go past the end of the gauge
        colorStart: color,   // Colors
        colorStop: color,    // just experiment with them
        strokeColor: '#E0E0E0',   // to see which ones work best for you
        generateGradient: true
      };
      var target = document.getElementsByClassName('gauge')[$scope.nodeIndex]; // your canvas element
      var gauge = new Gauge(target).setOptions(opts); // create sexy gauge!
      gauge.maxValue = Number($scope.gaugeStats.max_gauge); // set max gauge value
      // console.log($scope.gaugeStats.gauge_max);
      gauge.animationSpeed = 32; // set animation speed (32 is default value)
      gauge.set($scope.gaugeStats.spend_percentage); // set actual value
    }
  }
}])
