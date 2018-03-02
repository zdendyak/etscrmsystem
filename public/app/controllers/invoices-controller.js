angular.module('etsApp')
.controller('InvoicesCtrl', [
	'$scope', 
	'invoices',
	'InvoiceService',
	'ClientService',
	'UserService',
	'Notification',
	function($scope, invoices , InvoiceService, ClientService, UserService, Notification) {

		$scope.invoices = invoices;
		$scope.statuses = ['висланий', 'редагування', 'частково оплачений', 'оплачений', 'відхилений'];

		$scope.showAddForm = function() {
			$scope.editDoc = {};

			ClientService.getAllClients()
			.then(function(clients) {
				$scope.clients = clients;
			})
			.catch(function(error) {
				Notification.error(error.message);
				$('#editModal').modal('hide');
			});

			UserService.getAllUsers()
			.then(function(managers) {
				$scope.managers = managers;
			})
			.catch(function(error) {
				Notification.error(error.message);
				$('#editModal').modal('hide');
			});

			$('#editModal').modal('show');

		};

		
		$scope.openDoc = function(doc) {
			ClientService.getAllClients()
			.then(function(clients) {
				$scope.clients = clients;
			})
			.catch(function(error) {
				Notification.error(error.message);
				$('#editModal').modal('hide');
			});
			
			UserService.getAllUsers()
			.then(function(managers) {
				$scope.managers = managers;
			})
			.catch(function(error) {
				Notification.error(error.message);
				$('#editModal').modal('hide');
			});

			$scope.editDoc = angular.copy(doc);
			if ($scope.editDoc.date) {
				$scope.editDoc.date = new Date($scope.editDoc.date);
			};
			$('#editModal').modal('show');
		};

		$scope.saveDoc = function(editDoc) {			

			if (editDoc._id) {
				//update
				InvoiceService.updateInvoice(editDoc)
				.then(function(data) {
					Notification.success(data.message);
					InvoiceService.getAllInvoices()
					.then(function(invoices) {
						$scope.invoices = invoices;
					})
					.catch(function(error) {
						Notification.error(error.message);
					});
					$('#editModal').modal('hide');
				})
				.catch(function(error) {
					Notification.error(error.message)
				});
			} else {
				//save new 
				if (editDoc.number && editDoc.number !=="") {
					InvoiceService.addInvoice(editDoc)
					.then(function(data) {
						Notification.success(data.message);
						InvoiceService.getAllInvoices()
						.then(function(invoices) {
							$scope.invoices = invoices;
						})
						.catch(function(error) {
							Notification.error(error.message);
						});
						$('#editModal').modal('hide');
					})
					.catch(function(error) {
						Notification.error(error.message)
					});
				};
				
			}
			
		};

		$scope.deleteDoc = function(doc) {
			InvoiceService.deleteInvoice(doc)
			.then(function(data) {
				Notification.success(data.message);
				InvoiceService.getAllInvoices()
				.then(function(invoices) {
					$scope.invoices = invoices;
				})
				.catch(function(error) {
					Notification.error(error.message);
				});
			})
			.catch(function(error) {
				Notification.error(error.message);
			});
		};

		$scope.addFile = function(doc, file) {

			InvoiceService.addFile(doc, file)
			.then(function(data) {
				Notification.success(data.message);
				InvoiceService.getAllInvoices()
				.then(function(invoices) {
					$scope.invoices = invoices;
				})
				.catch(function(error) {
					Notification.error(error.message);
				});
			})
			.catch(function(error) {
				Notification.error(error.message);
			});
		};

		$scope.deleteFile = function(doc) {
			InvoiceService.deleteFile(doc)
			.then(function(data) {
				Notification.success(data.message);
				InvoiceService.getAllInvoices()
				.then(function(invoices) {
					$scope.invoices = invoices;
				})
				.catch(function(error) {
					Notification.error(error.message);
				});
			})
			.catch(function(error) {
				Notification.error(error.message);
			});
		};
}]);