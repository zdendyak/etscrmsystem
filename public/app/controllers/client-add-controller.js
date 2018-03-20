angular.module('etsApp')
.controller('AddClientCtrl', [
	'$scope', 
	'$state',
	'ClientService',
	function($scope, $state, ClientService) {
		$scope.client = {};
		$scope.error_message = '';
		$scope.title = 'Додати нового клієнта';

		$scope.saveClient = function(client) {
			ClientService.addClient(client)
			.then(function(data) {
				$scope.client = {};
				$scope.error_message = '';
				$state.go('dash.clientDetail', {id: data.client._id});
			})
			.catch(function(error) {
				$scope.error_message = error.message;
			});
		};

	}]);