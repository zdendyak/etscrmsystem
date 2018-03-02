angular.module('etsApp')
.factory('NoteService', [
	'$http', 
	function($http) {
		var factory = {};

		factory.getAllNoteOfClient = function(clientId) {
			$http.get('api/clients/' + clientId + '/notes')
			.then(function(result) {
				return result.data;
			})
			.catch(function(error) {
				return error;
			})
		};

		factory.addNote = function(note) {
			return $http.post('api/notes', note)
			.then(function(result) {
				return result.data;
			})
			.catch(function(error) { 
				return error
			});
		};

		factory.deleteNote = function(noteId) {
			return $http.delete('api/notes/' + noteId)
			.then(function(result) {
				return result.data;
			})
			.catch(function(error) {
				return error;
			});
		};

		return factory;
	}]);