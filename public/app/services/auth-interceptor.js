angular.module('etsApp')
	.factory('AuthInterceptor', [
		'$rootScope', 
		'$q',
		'$window', 
		'AUTH_EVENTS', 
		function($rootScope, $q, $window, AUTH_EVENTS) {
		return {
			responseError: function(response) {
				$rootScope.$broadcast({
					401: AUTH_EVENTS.notAuthenticated,
					403: AUTH_EVENTS.notAuthorized
				}[response.status], response);
				return $q.reject(response);
			},
			request: function(config) {
				var token = $window.localStorage['ets-token'];
				
				if (token) {
					config.headers.Authorization = token;
				};
				return config;
			}
		}
	}])
	.config(function($httpProvider) {
		$httpProvider.interceptors.push('AuthInterceptor');
	});