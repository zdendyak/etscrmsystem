var Contact = require('../models/contact');
var Client = require('../models/client');

module.exports.getAllContacts = function(req, res) {
	var query;
	if (req.user.role === 'Admin' || req.user.role === 'Engineer') {
		query = {};
	} else {
		query = {manager: req.user._id};
	};
	Contact.find(query)
	.populate('client', 'name')
	.populate('manager', 'firstName lastName')
	.exec(function(err, contacts) {
		if (err) {
			res.status(500).send({message: 'Вибачте,виникла помилка'});
		} else {
			res.json(contacts);
		};
	});
};

module.exports.getAllContactsOfClient = function(req, res) {
	var clientId = req.params.clientId;
	Contact.find({client: clientId}, function(err, contacts) {
		if (err) {
			res.status(500).send({message: 'Вибачте,виникла помилка'});
		} else {
			res.json(contacts);
		};
	});
};

module.exports.addContact = function(req, res) {
	var contact = new Contact(req.body);
	contact.manager = req.user._id;

	contact.save(function(err, contact) {
		if (err) {
			res.status(500).send({message: 'Вибачте,виникла помилка'});
		} else {
			Client.findOne({_id: contact.client}, function(err, client) {
				if (err) {
					res.status(500).send({message: 'Вибачте, виникла помилка при збережені данних'});
				} else {
					client.addContact(contact, function(err) {
						if (err) {
							res.status(500).send({message: 'Вибачте, виникла помилка при збережені данних'});
						} else {
							res.json(contact);
						};
					});
				};
			});
		};
	});
};

module.exports.updateContact = function(req, res) {
	var contactId = req.params.contactId;
	Contact.findById(contactId)
	.exec(function(err, contact) {
		if (err) {
			res.status(500).send({message: 'Вибачте, виникла помилка при збереженні данних'});
		} else {
			if (!contact) {
				return res.status(404).send({message: 'Контакт не знайдений'});
			};
			Object.assign(contact, req.body);
			contact.save(function(err, contact) {
				if (err) {
						res.status(500).send({message: 'Вибачте, виникла помилка при збереженні данних'});
					} else {
						res.send({message: 'Дані збережено', contact: contact});
					};
			});
		};
	});
};


module.exports.deleteContact = function(req, res) {
	var contactId = req.params.contactId;
	Contact.findById(contactId, function(err, contact) {
		if (err) {
			res.status(500).send({message: 'Вибачте, виникла помилка при видаленні данних'});
		} else {
			var clientId = contact.client;
			Client.findById(clientId)
			.exec(function(err, client) {
				if (err) {
					res.status(500).send({message: 'Вибачте, виникла помилка при видаленні данних'});
				} else {
					client.deleteContact(contactId, function(err) {
						if (err) {
							res.status(500).send({message: 'Вибачте, виникла помилка при видаленні данних'});
						} else {
							contact.remove(function(err) {
								if (err) {
									res.status(500).send({message: 'Вибачте, виникла помилка при видаленні данних'});
								} else {
									res.status(200).send({message: 'Дані успішно видалено!'})
								};
							});
						};
					});
				};
			});
		};
	});
};