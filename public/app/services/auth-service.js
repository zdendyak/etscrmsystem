angular.module('etsApp')
.factory('AuthService', [
	'$http', 
	'$window', 
	'$q', 
	'SessionService', 
	function($http, $window, $q, SessionService) {

	var auth = {};


	auth.saveToken = function(token) {
		$window.localStorage['ets-token'] = token;
		SessionService.setPhoto();
	};

	auth.register = function register (user) {
		return $q(function(resolve, reject) {
			$http.post('/auth/register', user)
			.then(function(result) {
				if (result.data.success) {
					auth.saveToken(result.data.token);	
					resolve(result.data);
				} else {
					reject(result.data);
				};
			})
			.catch(function(ressult) {
				reject(result.data);
			});
		});
	};

	auth.login = function login (user) {
		return $q(function(resolve, reject) {
			$http.post('/auth/login', user)
			.then(function(result) {
				if (result.data.success) {
					auth.saveToken(result.data.token);					
					resolve(result.data);
				} else {
					reject(result.data);
				};
			})
			.catch(function(ressult) {
				reject(result.data);
			});
		});
	};


	auth.logout = function() {
		$window.localStorage.removeItem('ets-token');
	};

	return auth;
}]);