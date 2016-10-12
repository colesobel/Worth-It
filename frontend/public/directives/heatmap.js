angular.module('myApp.heatmapDirective', [])


.directive('heatmap',[function() {
  return {
    restrict: 'E',
    template: '<div id="heatmap"></div>',
    scope: {
      days: '=',
      expenseCategories: '=',
      values: '='
    },
    controller: function($scope) {
      console.log($scope.expenseCategories);

      $(function () {

    $('#heatmap').highcharts({

        chart: {
            type: 'heatmap',
            marginTop: 40,
            marginBottom: 40
        },


        title: {
            text: ''
        },

        xAxis: {
            categories: $scope.days,
            labels: {
              style: {
                fontSize: '16px'
              }
            }
        },

        yAxis: {
            categories: $scope.expenseCategories,
            labels: {
              style: {
                fontSize: '16px'
              }
            },
            title: {
              text: ''
            }
        },

        colorAxis: {
            min: 0,
            minColor: '#FFFFFF',
            // maxColor: Highcharts.getOptions().colors[0]
            maxColor: '#FF0000'
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
                // return '<b>' + this.series.xAxis.categories[this.point.x] + '</b> sold <br><b>' +
                //     this.point.value + '</b> items on <br><b>' + this.series.yAxis.categories[this.point.y] + '</b>';
                return '$' + this.point.value + ' total spending on ' + this.series.xAxis.categories[this.point.x] + "'s this month in " + this.series.yAxis.categories[this.point.y]
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
