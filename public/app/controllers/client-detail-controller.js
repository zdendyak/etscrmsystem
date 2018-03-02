angular.module('etsApp')
.controller('ClientDetailCtrl', [
	'$scope',
	'client', 
	'NoteService',
	'ContactService',
	'Notification',
	function($scope, client, NoteService, ContactService, Notification) {
		$scope.error_message = '';
		$scope.client =	client;
		
		$scope.dateNow = new Date();

		$scope.showAddContactForm = function() {
			$scope.newContact = {};
			$scope.error_message = '';
		};

		$scope.showEditContactModal = function(person) {

			$scope.editContact = angular.copy(person);
			$('#editContactModal').modal('show');
			$scope.error_message = '';
		};

		$scope.saveContact = function(newContact) {
			if (newContact.name && newContact.name !== '') {
				newContact.client = client._id;
				ContactService.addContact(newContact)
				.then(function(data){
					$scope.client.contacts.push(data);
					$scope.error_message = '';
					$scope.newContact = {};
					$('#addContactModal').modal('hide');
				})
				.catch(function(error) {
					$scope.error_message = error.message;
					Notification.error({message: error.message});
				});
			};
		};

		$scope.updateContact = function(editContact) {
			ContactService.updateContact(editContact)
			.then(function() {
				ContactService.getAllContactsOfClient($scope.client._id)
				.then(function(data){
					$scope.client.contacts = data;
				})
				.catch(function(error){
					Notification.error({message: error.message});
					$scope.error_message = error.message;
				});
				$scope.error_message = '';
				$scope.editContact = {};
				$('#editContactModal').modal('hide');
			})
			.catch(function(error) {
				Notification.error({message: error.message});
				$scope.error_message = error.message;
			})
		};

		$scope.deleteContact = function(contactId) {
			ContactService.deleteContact(contactId)
			.then(function(){
				ContactService.getAllContactsOfClient($scope.client._id)
				.then(function(data){
					$scope.client.contacts = data;
				})
				.catch(function(error){
					Notification.error({message: error.message});
					$scope.error_message = error.message;
				});
				$scope.error_message = '';
			})
			.catch(function(error) {
				Notification.error({message: error.message});
				$scope.error_message = error.data;
			});
		};

		$scope.showAddNoteForm = function() {
			$scope.newNote = {};
			$scope.error_message = '';
		};

		$scope.saveNote = function(newNote) {
			if (newNote.text && newNote.text !== '') {
				newNote.client = $scope.client._id;
				NoteService.addNote(newNote)
				.then(function(data) {
					$scope.client.notes.push(data);
					$scope.error_message = '';
				})
				.catch(function(error) {
					console.log(error);
					Notification.error({message: error.message});
					$scope.error_message = error.message;
				});
				
				$scope.newNote = {};
				$('#addNoteModal').modal('hide');
			}
			
		};

		$scope.deleteNote = function(noteId) {
			NoteService.deleteNote(noteId)
			.then(function(data) {
				$scope.error_message = '';
				Notification.info({message: data.message});
			})
			.catch(function(error) {
				console.log(error);
				Notification.error({message: error.message});
				$scope.error_message = error.message;
			});
		};

		
}]);