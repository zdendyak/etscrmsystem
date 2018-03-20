angular.module('etsApp')
.factory('ClientService', [
	'$http', 
	function($http) {
		var factory = {};

		factory.getAllClients = function() {
			return $http.get('api/clients')
			.then(function(result) {
				return result.data;
			}).
			catch(function(err) {
				return err;
			});
		};

		factory.getClientById = function(id) {
			return $http.get('api/clients/' + id)
			.then(function(result) {
				return result.data;
			}).
			catch(function(err) {
				return err;
			});
		};

		factory.addClient = function(client) {
			return $http.post('api/clients', client)
			.then(function(result) {
				return result.data;
			}).
			catch(function(err) {
				return err;
			});
		};

		factory.updateClient = function(id, client) {
			return $http.put('api/clients/' + id , client)
			.then(function(result) {
				return result.data;
			}).
			catch(function(err) {
				return err;
			});
		};

		factory.deleteClient = function(id) {
			return $http.delete('api/clients/' + id)
			.then(function(result) {
				return result.data;
			}).
			catch(function(err) {
				return err;
			});
		};

		return factory;
	}]);