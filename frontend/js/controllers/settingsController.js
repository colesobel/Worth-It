angular.module('myApp.settingsController', [])

.controller('settingsController', ['$http', '$state', '$rootScope', function($http, $state, $rootScope) {
  let user_id = Number(localStorage.getItem('user_id'))
  let settings = this
  let selectedTab = 'expenseCategories'

  settings.selectTab = (li, name) => {
  let tabs = document.getElementsByTagName('li')
  for(let i = 0; i < tabs.length; i++) {
    tabs[i].className = ''
  }
  li = document.getElementById(li)
  li.className = 'selected'
  selectedTab = name
}


}])
