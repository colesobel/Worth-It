var app = angular.module('myApp', ['ui.router', 'myApp.loginController', 'myApp.homeController', 'myApp.services', 'myApp.gaugeDirective', 'myApp.filters', 'myApp.addExpenseController', 'myApp.settingsController', 'myApp.categoryDetailController', 'myApp.barChartDirective', 'myApp.navDirective', 'myApp.heatmapDirective'])

app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {
  $urlRouterProvider.otherwise('home')
  $stateProvider
    .state('login', {
      url: '/',
      templateUrl: '/partials/login.html',
      controller: 'loginController',
      controllerAs: 'login'
    })
    .state('home', {
      url: '/home',
      templateUrl: '/partials/home.html',
      controller: 'homeController',
      controllerAs: 'home'
    })
    .state('addExpense', {
      url: '/addExpense',
      templateUrl: '/partials/addExpense.html',
      controller: 'addExpenseController',
      controllerAs: 'addExpense'
    })
    .state('settings', {
      url: '/settings',
      templateUrl: '/partials/settings.html',
      controller: 'settingsController',
      controllerAs: 'settings'
    })
    .state('categoryDetail', {
      url: '/categoryDetail/:categoryName',
      templateUrl: '/partials/categoryDetail.html',
      controller: 'categoryDetailController',
      controllerAs: 'cd'
    })
    // $locationProvider.html5Mode(true);
}])
