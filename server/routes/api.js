
var multiparty = require('connect-multiparty');
var express = require('express');

module.exports = function(passport) {
	var router = express.Router();

	//cheack authentication
	var requireAuth = passport.authenticate('jwt', {session: false});
	router.use(requireAuth);

	//multiparty middleware
	var multipartMiddleware = multiparty();

	//controllers
	var userController = require('../controllers/user-controller');
	var clientController = require('../controllers/client-controller');
	var noteController = require('../controllers/note-controller');
	var contactController = require('../controllers/contact-controller');
	var offerController = require('../controllers/offer-controller');
	var invoiceController = require('../controllers/invoice-controller');
	
	//models
	var Client = require('../models/client');

	//params
	router.param('clientId', function(req, res, next, id) {
		var query = Client.findById(id)
		.populate('notes contacts');

		query.exec(function(err, client) {
			if (err) { return next(err); };
			if (!client) { return next(new Error('Клієнт відсутній')) ;};

			req.client = client;
			return next();
		});
	});

	//routes

	router.get('/clients', clientController.getAllClients);
	router.get('/clients/:clientId', clientController.getClientById);
	router.post('/clients', clientController.addClient);
	router.put('/clients/:clientId', clientController.updateClient);
	router.delete('/clients/:clientId', clientController.deleteClient);
	router.get('/clients/:clientId/notes', noteController.getAllNoteOfClient);

	router.get('/notes', noteController.getAllNotes);
	router.post('/notes', noteController.addNote);
	router.delete('/notes/:noteId', noteController.deleteNote);

	router.get('/clients/:clientId/contacts', contactController.getAllContactsOfClient);
	router.get('/contacts', contactController.getAllContacts);
	router.post('/contacts', contactController.addContact);
	router.put('/contacts/:contactId', contactController.updateContact);
	router.delete('/contacts/:contactId', contactController.deleteContact);

	router.get('/offers', offerController.getAllOffers);
	router.get('/offers/:offerId', offerController.getOfferById);	
	router.post('/offers', offerController.addOffer);
	router.put('/offers/:offerId', offerController.updateOffer);
	router.delete('/offers/:offerId', offerController.deleteOffer);
	router.put('/offers/:offerId/file', multipartMiddleware, offerController.addOfferFile);
	router.delete('/offers/:offerId/file', offerController.deleteOfferFile);

	router.get('/invoices', invoiceController.getAllInvoices);
	router.get('/invoices/:invoiceId', invoiceController.getInvoiceById);
	router.post('/invoices', invoiceController.addInvoice);
	router.put('/invoices/:invoiceId', invoiceController.updateInvoice);
	router.delete('/invoices/:invoiceId', invoiceController.deleteInvoice);
	router.put('/invoices/:invoiceId/file', multipartMiddleware, invoiceController.addInvoiceFile);
	router.delete('/invoices/:invoiceId/file', invoiceController.deleteInvoiceFile);

	
	return router;
};