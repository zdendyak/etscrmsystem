angular.module('etsApp')
.factory('InvoiceService', [
	'$http',
	'$log',
	'Upload',
	function($http, $log, Upload) {
		var factory = {};

		factory.getAllInvoices = function() {
			return $http.get('/api/invoices')
			.then(function(result) {
				return result.data;
			})
			.catch(function(error) {
				return error.data;
			})
		};

		factory.addInvoice = function(invoice) {
			return $http.post('/api/invoices', invoice)
			.then(function(result) {
				return result.data;
			})
			.catch(function(error) {
				return error.data;
			});
		};

		factory.updateInvoice = function(invoice) {
			return $http.put('/api/invoices/' + invoice._id, invoice)
			.then(function(result) {
				return result.data;
			})
			.catch(function(error) {
				return error.data;
			});
		};

		factory.deleteInvoice = function(invoice) {
			//delete file if exist
			if (invoice.file) {
				factory.deleteFile(invoice)
				.then(function(result) {

				})
				.catch(function(err) {
					$log.error(err.message);
				});
			};

			return $http.delete('/api/invoices/' + invoice._id)
			.then(function(result) {
				return result.data;
			})
			.catch(function(error) {
				return error.data;
			});
		};

		factory.addFile = function(invoice, file) {
			return Upload.upload({
				url: '/api/invoices/' + invoice._id + '/file',
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

		factory.deleteFile = function(invoice) {
			return $http.delete('/api/invoices/' + invoice._id + '/file')
			.then(function(result) {
				return result.data;
			})
			.catch(function(error) {
				return error.data;
			});
		};

		return factory;
	}]);