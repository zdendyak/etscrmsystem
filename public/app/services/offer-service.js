angular.module('etsApp')
.factory('OfferService', [
	'$http',
	'Notification',
	'Upload',
	function($http, Notification, Upload) {
		var factory = {};

		factory.getAllOffers = function() {
			return $http.get('/api/offers')
			.then(function(result) {
				return result.data;
			})
			.catch(function(error) {
				return error.data;
			})
		};

		factory.addOffer = function(offer) {
			return $http.post('/api/offers', offer)
			.then(function(result) {
				return result.data;
			})
			.catch(function(error) {
				return error.data;
			});
		};

		factory.updateOffer = function(offer) {
			return $http.put('/api/offers/' + offer._id, offer)
			.then(function(result) {
				return result.data;
			})
			.catch(function(error) {
				return error.data;
			});
		};

		factory.deleteOffer = function(offer) {
			if (offer.file) {
				factory.deleteFile(offer)
				.then(function(data) {
					Notification.success(data.message);
				})
				.catch(function(err) {
					Notification.error(err.message);
				});
			};
			return $http.delete('/api/offers/' + offer._id)
			.then(function(result) {
				return result.data;
			})
			.catch(function(error) {
				return error.data;
			});
		};

		factory.addFile = function(offer, file) {

			return Upload.upload({
				url: '/api/offers/' + offer._id + '/file',
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

		factory.deleteFile = function(offer) {
			return $http.delete('/api/offers/' + offer._id + '/file')
			.then(function(result) {
				return result.data;
			})
			.catch(function(error) {
				return error.data;
			});
		};

		return factory;
	}]);