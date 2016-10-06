angular.module('myApp.barChartDirective', [])

.directive('barChart',['getColor', function(getColor) {
  return {
    restrict: 'E',
    template: `<div id="daily-avg-bar"></div>`,
    scope: {
      data: '=',
    },
    controller: function($scope) {
    google.charts.load("current", {packages:['corechart']});
    google.charts.setOnLoadCallback(drawChart);
    function drawChart() {
      var data = google.visualization.arrayToDataTable($scope.data);

      var view = new google.visualization.DataView(data);
      view.setColumns([0, 1,
                       { calc: "stringify",
                         sourceColumn: 1,
                         type: "string",
                         role: "annotation" },
                       2]);

      var options = {
        title: "Spending By Expense Category",
        width: 600,
        height: 400,
        bar: {groupWidth: "95%"},
        legend: { position: "none" },
      };
      var chart = new google.visualization.ColumnChart(document.getElementById("daily-avg-bar"));
      chart.draw(view, options);
    }
    }
  }
}])
