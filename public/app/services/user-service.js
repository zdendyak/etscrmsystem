angular.module('etsApp')
.factory('UserService', [
	'$http', 
	'$window',
	'SessionService', 
	'Upload',
	function($http, $window, SessionService, Upload) {
	var token = SessionService.getToken();
	var payload = JSON.parse($window.atob(token.split('.')[1]));
	var userId = payload.id;


	var obj = {};

	obj.getUserById = function(id) {
		return $http.get('/users/' + id)
				.then(function(result) {
					return result.data;
				})
				.catch(function(error) {
					return error.data;
				});
	};

	obj.getAllUsers = function() {
		return $http.get('/users')
		.then(function(result) {
			return result.data
		})
		.catch(function(error) {
			return error.data;
		});
	};

	obj.getProfile = function() {
		return $http.get('/users/' + userId)
		.then(function(result) {
			return result.data;
		})
		.catch(function(error) {
			return error.data;
		});
	};

	obj.updateProfile = function(user) {
		return $http.put('/users/' + userId, user)
		.then(function(result) {
			return result.data;
		})
		.catch(function(error) {
			return error.data;
		});
	};

	obj.updatePhoto = function(file) {
		return Upload.upload({
			url: '/users/' + userId + '/updatePhoto',
			method: 'PUT',
			data: {file: file}			
		})
		.then(function(result) {
			return result.data;
		})
		.catch(function(error) {
			return error.data;
		});

	
	};

	return obj;
}]);