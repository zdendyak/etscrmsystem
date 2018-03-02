angular.module('etsApp')
.controller('EditClientCtrl', [
	'$scope',
	'$state',
	'client', 
	'ClientService',
	function($scope, $state, client, ClientService) {
		$scope.title = 'Редагувати дані клієнта';
		$scope.error_message = '';

		$scope.client =	client;
		
		$scope.saveClient = function(client) {
			ClientService.updateClient(client._id, client)
			.then(function(data){
				$scope.error_message = '';
				$state.go('dash.clientDetail', {id: data.client._id});
			})
			.catch(function(error) {
				$scope.error_message = error.message;
			});
		}
}]);