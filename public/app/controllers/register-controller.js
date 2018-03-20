angular.module('etsApp')
.controller('RegisterCtrl', ['$scope', '$state', 'AuthService', function($scope, $state, AuthService) {
	$scope.error_message = '';

	$scope.register = function(user) {
		AuthService.register(user)
		.then(function(data) {
			$state.go('dash.profile');
		})
		.catch(function(data) {
			
			$scope.error_message = data.message;
		});
	};
}]);