angular.module('etsApp')
.factory('ContactService', [
	'$http',
	function($http) {
		var factory = {};

		factory.getAllContacts = function() {
			return $http.get('api/contacts')
			.then(function(result) {
				return result.data;
			})
			.catch(function(error) {
				return error;
			});
		};

		factory.getAllContactsOfClient = function(clientId) {
			return $http.get('api/clients/' + clientId + '/contacts')
			.then(function(result) {
				return result.data;
			})
			.catch(function(error) {
				return error;
			})
		};

		factory.getContactById = function(id) {
			return $http.get('api/contacts' + id)
			.then(function(result) {
				return result.data;
			})
			.catch(function(error) {
				return error;
			});
		};

		factory.addContact = function(contact) {
			return $http.post('api/contacts', contact)
			.then(function(result) {
				return result.data;
			})
			.catch(function(error) {
				return error;
			});
		};

		factory.updateContact = function(contact) {
			return $http.put('api/contacts/' + contact._id, contact) 
			.then(function(result) {
				return result.data;
			})
			.catch(function(error) {
				return(error);
			});
		};

		factory.deleteContact = function(id) {
			return $http.delete('api/contacts/' + id)
			.then(function(result) {
				return result.data;
			})
			.catch(function(error) {
				return error;
			});
		};

		return factory;
	}]);