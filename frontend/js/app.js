var app = angular.module('myApp', ['ui.router', 'myApp.loginController', 'myApp.homeController', 'myApp.services', 'myApp.gaugeDirective'])

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
    // $locationProvider.html5Mode(true);
}])
