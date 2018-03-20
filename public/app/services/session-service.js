angular.module('etsApp')
.factory('SessionService', [
	'$http', 
	'$window', 
	function($http, $window) {
	
	var session = {};

	session.getToken = function() {
		return $window.localStorage['ets-token'];
	};

	session.isAuthenticated = function() {
		var token = session.getToken();

		if (token) {
			var payload = JSON.parse($window.atob(token.split('.')[1]));
			return payload.exp > Date.now() / 1000;
		} else {
			return false;  
		}
		
	};

	session.currentUser = function() {
		
		if (session.isAuthenticated()) {
			var token = session.getToken();
			var payload = JSON.parse($window.atob(token.split('.')[1]));

			return payload;
		};

		return null;
	};

	session.setPhoto = function(photo) {
		if (photo) {
			$window.localStorage['user-photo'] = photo;
		} else {
			var user = session.currentUser();
			if (user) {
				$window.localStorage['user-photo'] = user.photo;
			};
		};	
		
	};

	session.getPhoto = function() {
		return $window.localStorage['user-photo'];
	};

	return session;
}]);