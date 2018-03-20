var Client = require('../models/client');

module.exports.getAllClients = function(req, res) {
	var query;
	if (req.user.role === 'Admin' || req.user.role === 'Engineer') {
		query = {};
	} else {
		query = {manager: req.user._id};
	};

	Client.find(query)
	.populate('contacts')
	.exec(function(err, clients) {
		if (err) {
			res.status(500).send({message: 'Вибачте, виникла помилка при отриманні данних'});
		} else {
			res.json(clients);
		};
	});
};

module.exports.getClientById = function(req, res) {

	if (req.client) {

		if (req.user._id.toString() === req.client.manager.toString() || req.user.role === 'Admin' || req.user.role === 'Engineer') {
			res.json(req.client);				
		} else {
			res.status(403).send({message: 'У Вас недостатньо прав, щоб отримати дані'});
		};
		
	} else {
		res.status(500).send({message: 'Вибачте, виникла помилка при отриманні данних'});
	};
	
	/*
	Client.findById(req.params.clientId, function(err, client) {
		if (err) {
			res.status(500).send({message: 'Вибачте, виникла помилка при отриманні данних'});
		} else {
			if (req.user._id.toString() === client.manager.toString() || req.user.role === 'Admin' || req.user.role === 'Engineer') {
				if (client) {
					res.json(client);
				};
				
			} else {
				res.status(403).send({message: 'У Вас недостатньо прав, щоб отримати дані'});
			};
		};
	});*/
};

module.exports.addClient = function(req, res) {
	var client = new Client(req.body);
	client.manager = req.user._id;

	client.save(function(err, client) {
		if (err) {
			res.status(500).send({message: 'Вибачте, виникла помилка при збереженні данних'});
		} else {
			res.send({message: 'Дані збережено', client: client});
		};
	});
};

module.exports.updateClient = function(req, res) {
	var id = req.params.clientId;
	Client.findById(id)
	.exec(function(err, client) {
		if (err) {
			res.status(500).send({message: 'Вибачте, виникла помилка при збереженні данних'});
		} else {
			if (!client) {
				return res.status(404).send({message: 'Клієнт не знайдений'});
			};
			if (req.user._id.toString() === client.manager.toString() || req.user.role === 'Admin' || req.user.role === 'Engineer') {
				//update data
				Object.assign(client, req.body);
				client.save(function(err, client) {
					if (err) {
						res.status(500).send({message: 'Вибачте, виникла помилка при збереженні данних'});
					} else {
						res.send({message: 'Дані збережено', client: client});
					};
				});
			} else {
				res.status(403).send({message: 'У Вас недостатньо прав, щоб оновити дані'});
			}
		}
	});
};

module.exports.deleteClient = function(req, res) {
	Client.findById(req.params.clientId)
	.exec(function(err, client) {
		if (err) return res.status(500).send({message: 'Вибачте, виникла помилка'});
		if (req.user._id.toString() === client.manager.toString() || req.user.role === 'Admin' || req.user.role === 'Engineer') {
			client.remove(function(err) {
				if (err) {
					res.status(500).send({message: 'Вибачте, виникла помилка при видаленні данних'});
				} else {
					res.status(200).send({message: 'Дані видалені'});
				}
			});
		} else {
			res.status(403).send({message: 'У Вас недостатньо прав, щоб видалити дані'});
		};
	});
	
};