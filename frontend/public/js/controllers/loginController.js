angular.module('myApp.loginController', [])

.controller('loginController', ['$http', '$state', '$rootScope', function($http, $state, $rootScope) {
	let login = this
	login.signupForm = true
  login.blockLogin = false
  login.blockSignup = false

  login.loginInfo = {}
  login.login = (loginForm) => {
    $http.post('https://whispering-shelf-88050.herokuapp.com/login/login', login.loginInfo).then(user => {
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
    $http.post('https://whispering-shelf-88050.herokuapp.com/login/signup', login.signupInfo).then(data => {
      if (data.data) {
        localStorage.setItem('user_id', data.data)
        $state.go('settings')
      } else {
        login.blockSignup = true
      }
    })
  }

	login.guestLogin = function() {
		$http.post('https://whispering-shelf-88050.herokuapp.com/login/login', {username: 'john@doe.com', password: 'johndoe'}).then(user => {
			if (user.data) {
				localStorage.setItem('user_id', user.data)
				$state.go('home')
			} else {
				login.blockLogin = true
			}
		})
	}


}])
