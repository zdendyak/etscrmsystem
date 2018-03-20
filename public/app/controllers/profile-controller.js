angular.module('etsApp')
.controller('ProfileCtrl', [
	'$scope',
	'UserService',
	'SessionService',
	function($scope, UserService, SessionService) {
		$scope.error_message = "";

		UserService.getProfile() 
		.then(function(data) {
			$scope.user = data;
		})
		.catch(function(error) {
			$scope.error_message = error;
		});

		$scope.update = function(user) {
			UserService.updateProfile(user)
			.then(function(data) {
				console.log(data);
				$scope.user = data.user;
			})
			.catch(function(error) {
				$scope.error_message = error;
			});
		};

		$scope.updatePhoto = function(file) {
			UserService.updatePhoto(file)
			.then(function(data) {
				$scope.file = undefined;
				$scope.user = data.user;
				SessionService.setPhoto(data.user.photo);
			})
			.catch(function(error) {
				$scope.error_message = error;
			});
		};
}]);