angular.module('myApp.barChartDirective', [])

.directive('barChart',['getColor', function(getColor) {
  return {
    restrict: 'E',
    template: `<div class="bar-chart"></div>`,
    scope: {
      data: '=',
      nodeIndex: '=',
      chartTitle: '='
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
        title: $scope.chartTitle,
        // titleTextStyle: { color: 'black',
        //   fontName: "Helvetica Neue",
        //   fontSize: '20px',
        //   bold: false,
        //   italic: false },
        height: 700,
        chartArea: {left: '10%', width:'80%',height:'75%'},
        vAxis: {
          gridlines: {
            count: 0
          }
        },
        bar: {groupWidth: "95%"},
        legend: { position: "none" },
        gridlines: {
          count: 2
        }
      };
      var chart = new google.visualization.ColumnChart(document.getElementsByClassName('bar-chart')[$scope.nodeIndex]);
      chart.draw(view, options);
    }
    }
  }
}])
