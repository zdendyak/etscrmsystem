angular.module('etsApp')
.factory('ContractService', [
	'$http',
	'Upload',
	function($http, Upload) {
		var factory = {};

		factory.getAllContracts = function() {
			return $http.get('/api/contracts')
			.then(function(result) {
				return result.data;
			})
			.catch(function(error) {
				return error.data;
			})
		};

		factory.addContract = function(contract) {
			return $http.post('/api/contracts', contract)
			.then(function(result) {
				return result.data;
			})
			.catch(function(error) {
				return error.data;
			});
		};

		factory.updateContract = function(contract) {
			return $http.put('/api/contracts/' + contract._id, contract)
			.then(function(result) {
				return result.data;
			})
			.catch(function(error) {
				return error.data;
			});
		};

		factory.deleteContract = function(contract) {
			return $http.delete('/api/contracts/' + contract._id)
			.then(function(result) {
				return result.data;
			})
			.catch(function(error) {
				return error.data;
			});
		};

		factory.addFile = function(contract, file) {
			Upload.upload({
				url: '/api/contracts/' + contract._id + '/file',
				method: 'PUT',
				data: {file: file}
			})
			.then(function(result) {
				return result.data;
			})
			.catch(function(error) {
				return error.data;
			});
		};

		factory.deleteFile = function(contract) {
			return $http.delete('/api/concontracttracts/' + contract._id + '/file')
			.then(function(result) {
				return result.data;
			})
			.catch(function(error) {
				return error.data;
			});
		};

		return factory;
	}]);