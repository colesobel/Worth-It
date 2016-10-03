angular.module('myApp.loginController', [])

.controller('loginController', ['$http', '$state', '$rootScope', function($http, $state, $rootScope) {
	let login = this
  login.blockLogin = false
  login.blockSignup = false

  login.loginInfo = {}
  login.login = (loginForm) => {
    $http.post('http://localhost:3000/login/login', login.loginInfo).then(user => {
      if (user.data) {
        localStorage.setItem('user_id', user.data)
        $state.go('home')
      } else {
        login.blockLogin = true
      }
    })
  }

  login.signupInfo = {}
  login.signUp = (signupForm) => {
    console.log(login.signupInfo);
    if (login.signupInfo.password !== login.signupInfo.passwordConfirmation) {
      console.log('passwords must match');
      return
    }
    $http.post('http://localhost:3000/login/signup', login.signupInfo).then(data => {
      if (data.data) {
        console.log(data.data);
        localStorage.setItem('user_id', data.data)
        $state.go('home')
      } else {
        login.blockSignup = true
      }
    })
  }


}])
