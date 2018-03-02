angular.module('etsApp')
.controller('ClientsCtrl', [
	'$scope', 
	'$state',
	'clients',
	'ClientService',
	function($scope, $state, clients, ClientService) {
		$scope.error_message = '';
		$scope.clients = clients;
		
		$scope.delete = function(id) {
			ClientService.deleteClient(id)
			.then(function(data) {
				$scope.error_message = '';
				$state.reload()
			})
			.catch(function(error) {
				$scope.error_message = error.message;
			});
		};

}]);