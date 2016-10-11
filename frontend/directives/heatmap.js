angular.module('myApp.heatmapDirective', [])


.directive('heatmap',[function() {
  return {
    restrict: 'E',
    template: '<h1>Heatmap</h1><div id="heatmap"></div>',
    scope: {
      days: '=',
      expenseCategories: '=',
      values: '='
    },
    controller: function($scope) {
      // $scope.values.

      $(function () {

    $('#heatmap').highcharts({

        chart: {
            type: 'heatmap',
            marginTop: 40,
            marginBottom: 40
        },


        title: {
            text: 'Incremental Spending by Expense Category / Day ($)'
        },

        xAxis: {
            categories: $scope.days
        },

        yAxis: {
            categories: $scope.expenseCategories,
            title: null
        },

        colorAxis: {
            min: 0,
            minColor: '#FFFFFF',
            maxColor: Highcharts.getOptions().colors[0]
        },

        legend: {
            align: 'right',
            layout: 'vertical',
            margin: 0,
            verticalAlign: 'top',
            y: 25,
            symbolHeight: 320
        },

        tooltip: {
            formatter: function () {
                return '<b>' + this.series.xAxis.categories[this.point.x] + '</b> sold <br><b>' +
                    this.point.value + '</b> items on <br><b>' + this.series.yAxis.categories[this.point.y] + '</b>';
            }
        },

        series: [{
            borderWidth: 1,
            data: $scope.values,
            dataLabels: {
                enabled: true,
                color: 'black',
                style: {
                    textShadow: 'none'
                }
            }
        }]

    });
});




    }
  }
}])