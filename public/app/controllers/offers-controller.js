angular.module('etsApp')
.controller('OffersCtrl', [
	'$scope', 
	'offers',
	'OfferService',
	'ClientService',
	'UserService',
	'Notification',
	function($scope, offers , OfferService, ClientService, UserService, Notification) {

		$scope.offers = offers;
		$scope.statuses = ['на розгляді',  'прийнята', 'редагування', 'відхилена'];

		$scope.showAddForm = function() {
			$scope.editOffer = {};

			ClientService.getAllClients()
			.then(function(clients) {
				$scope.clients = clients;
			})
			.catch(function(error) {
				Notification.error(error.message);
				$('#editOfferModal').modal('hide');
			});

			UserService.getAllUsers()
			.then(function(managers) {
				$scope.managers = managers;
			})
			.catch(function(error) {
				Notification.error(error.message);
				$('#editOfferModal').modal('hide');
			});

			$('#editOfferModal').modal('show');

		};

		
		$scope.openOffer = function(offer) {
			ClientService.getAllClients()
			.then(function(clients) {
				$scope.clients = clients;
			})
			.catch(function(error) {
				Notification.error(error.message);
				$('#editOfferModal').modal('hide');
			});
			
			UserService.getAllUsers()
			.then(function(managers) {
				$scope.managers = managers;
			})
			.catch(function(error) {
				Notification.error(error.message);
				$('#editOfferModal').modal('hide');
			});

			$scope.editOffer = angular.copy(offer);
			if ($scope.editOffer.date) {
				$scope.editOffer.date = new Date($scope.editOffer.date);
			};
			$('#editOfferModal').modal('show');
		};

		$scope.saveOffer = function(editOffer) {			

			if (editOffer._id) {
				//update
				OfferService.updateOffer(editOffer)
				.then(function(data) {
					Notification.success(data.message);
					OfferService.getAllOffers()
					.then(function(offers) {
						$scope.offers = offers;
					})
					.catch(function(error) {
						Notification.error(error.message);
					});
					$('#editOfferModal').modal('hide');
				})
				.catch(function(error) {
					Notification.error(error.message)
				});
			} else {
				//save new offer
				if (editOffer.number && editOffer.number !=="") {
					OfferService.addOffer(editOffer)
					.then(function(data) {
						Notification.success(data.message);
						OfferService.getAllOffers()
						.then(function(offers) {
							$scope.offers = offers;
						})
						.catch(function(error) {
							Notification.error(error.message);
						});
						$('#editOfferModal').modal('hide');
					})
					.catch(function(error) {
						Notification.error(error.message)
					});
				};
				
			}
			
		};

		$scope.deleteOffer = function(offer) {
			OfferService.deleteOffer(offer)
			.then(function(data) {
				Notification.success(data.message);
				OfferService.getAllOffers()
				.then(function(offers) {
					$scope.offers = offers;
				})
				.catch(function(error) {
					Notification.error(error.message);
				});
			})
			.catch(function(error) {
				Notification.error(error.message);
			});
		};

		$scope.addFile = function(offer, file) {

			OfferService.addFile(offer, file)
			.then(function(data) {
				Notification.success(data.message);
				OfferService.getAllOffers()
				.then(function(offers) {
					$scope.offers = offers;
				})
				.catch(function(error) {
					Notification.error(error.message);
				});
			})
			.catch(function(error) {
				Notification.error(error.message);
			});
		};

		$scope.deleteFile = function(offer) {
			OfferService.deleteFile(offer)
			.then(function(data) {
				Notification.success(data.message);
				OfferService.getAllOffers()
				.then(function(offers) {
					$scope.offers = offers;
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