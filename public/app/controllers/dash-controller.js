angular.module('etsApp')
.controller('DashCtrl', [
	'$scope', 
	'$state', 
	'$rootScope',
	'AuthService',
	'SessionService',
	'AUTH_EVENTS', 
	function($scope, $state, $rootScope, AuthService, SessionService, AUTH_EVENTS) {
	$scope.currentUser = SessionService.currentUser;
	$scope.getPhoto = SessionService.getPhoto;
	
	$scope.logout = function() {
		AuthService.logout();
		$state.go('auth.login');
	};

	$rootScope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
		AuthService.logout();
		$state.go('auth.login');
	});
}]);