angular.module('etsApp')
.controller('LoginCtrl', ['$scope', '$state', 'AuthService', function($scope, $state, AuthService) {
	$scope.error_message = '';

	$scope.login = function(user) {
		AuthService.login(user)
		.then(function(data) {
			$state.go('dash.main');
		})
		.catch(function(data) {
			
			$scope.error_message = data.message;
		});
	};
}]);