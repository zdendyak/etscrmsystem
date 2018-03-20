angular.module('etsApp')
.controller('ContactsCtrl', [
	'$scope', 
	'contacts',
	'ContactService',
	'ClientService',
	function($scope, contacts, ContactService, ClientService) {

	$scope.contacts = contacts;

	$scope.showAddForm = function() {
		$scope.newContact = {};
		ClientService.getAllClients()
		.then(function(clients) {
			$scope.clients = clients;
		})
		.catch(function(error) {
			console.log(error.message);
			$('#editContactModal').modal('hide');
		});
	};

	$scope.openContact = function(contact) {
		$('#editContactModal').modal('show');
		$scope.newContact = angular.copy(contact);
		ClientService.getAllClients()
		.then(function(clients) {
			$scope.clients = clients;
		})
		.catch(function(error) {
			console.log(error.message);
			$('#editContactModal').modal('hide');
		});
	};

	$scope.saveContact = function(editContact) {
		if (editContact._id) {
			ContactService.updateContact(editContact)
			.then(function() {
				ContactService.getAllContacts()
				.then(function(contacts) {
					$scope.contacts = contacts;
				})
				.catch(function(error) {
					console.log(error.message);
				});
				$('#editContactModal').modal('hide');
			})
			.catch(function(error) {
				console.log(error.message);
			});
		} else {
			if (editContact.name && editContact.client._id && 
				editContact.name !== '' && editContact.client._id !== '') {
				ContactService.addContact(editContact)
				.then(function() {
					ContactService.getAllContacts()
					.then(function(contacts) {
						$scope.contacts = contacts;
					})
					.catch(function(error) {
						console.log(error.message);
					});
					$('#editContactModal').modal('hide');
				})
				.catch(function(error) {
					console.log(error.message);
				});
			}
			
		};	

		

	};

	

}]);