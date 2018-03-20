var Offer = require('../models/offer');
var path = require('path');
var fs = require('fs');

module.exports.getAllOffers = function(req, res) {
	var query;
	if (req.user.role === 'Admin' || req.user.role === 'Manager') {
		query = {};
	} else {
		query = {manager: req.user._id};
	};

	Offer.find(query)
	.populate('client', 'name')
	.populate('manager', 'firstName lastName')
	.exec(function(err, offers) {
		if (err) {
			res.status(500).send({message:  'Вибачте, виникла помилка при отриманні данних'});
		} else {
			res.json(offers);
		};
	});
};

module.exports.getOfferById = function(req, res) {
	Offer.findById(req.params.offerId)
	.populate('client', 'name')
	.populate('manager', 'firstName lastName')
	.exec(function(err, offer) {
		if (err) {
			res.status(500).send({message: 'Вибачте, виникла помилка при отриманні данних'});
		} else {
			if (req.user._id.toString() === offer.manager._id || req.user.role === 'Admin' || req.user.role === 'Engineer') {
				if (offer) {
					res.json(offer);
				} else {
					res.status(500).send({message: 'Вибачте, виникла помилка при отриманні данних'});
				}
			} else {
				res.status(403).send({message: 'У Вас недостатньо прав, щоб отримати дані'});
			}
		}
	});
};

module.exports.addOffer = function(req, res) {
	if (req.body) {
		var offer = new Offer(req.body);
		offer.manager = req.user._id;

		offer.save(function(err, offer) {
			if (err) {
				res.status(500).send({message: 'Вибачте, виникла помилка при збереженні данних'});
			} else {
				res.send({message: 'Дані збережено', offer: offer});
			};
		});
	} else {
		res.send({message: 'Ви не надали необхідних данних'});
	};
};

module.exports.updateOffer = function(req, res) {
	var id = req.params.offerId;
	Offer.findById(id)
	.exec(function(err, offer) {
		if (err) {
			res.status(500).send({message: 'Вибачте, виникла помилка при збереженні данних'});
		} else {
			if (!offer) {
				return res.status(404).send({message: 'Пропозиція не знайдена'});
			};
			if (req.user._id.toString() === offer.manager.toString()|| req.user.role === 'Admin' || req.user.role === 'Engineer') {
				Object.assign(offer, req.body);
				offer.save(function(err, offer) {
					if (err) {
						res.status(500).send({message: 'Вибачте, виникла помилка при збереженні данних'});
					} else {
						res.send({message: 'Дані збережено', offer: offer});
					};
				});
			} else {
				res.status(403).send({message: 'У Вас недостатньо прав, щоб оновити дані'});
			}
		}
	});
};

module.exports.deleteOffer = function(req, res) {
	Offer.findById(req.params.offerId)
	.exec(function(err, offer) {
		if (err) return res.status(500).send({message: 'Вибачте, виникла помилка'});
		if (req.user._id.toString() === offer.manager.toString() || req.user.role === 'Admin' || req.user.role === 'Engineer') {
			offer.remove(function(err) {
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

module.exports.addOfferFile = function(req, res) {
	if (req.files.file) {
		var file = req.files.file;
		var id = req.params.offerId;

		var uploadDate = new Date().getTime().toString();
		var tempPath = file.path;
		var targetPath = path.join(__dirname, '../../uploads/offers/' + uploadDate + '__' + file.name);
		var savePath = '/offers/' + uploadDate + '__' + file.name ;

		fs.rename(tempPath, targetPath, function(err) {
			if (err) {
				res.status(500).send({message: 'Не вдалося зберегти файл'});
			} else {
				Offer.findById(id)
				.exec(function(err, offer) {
					if (err) {
						res.status(500).send({message: 'Не вдалося зберегти файл'});
						//  delete file
						fs.unlink(targetPath, function(err) {
							if (err) res.status(500).send({message: 'Виникла помилка при видалені файлу'});
						});
					} else {
						offer.file = savePath;
						offer.save(function(err, offer) {
							if (err) {
								res.status(500).send({message: 'Не вдалося зберегти файл'});
								// delete file
								fs.unlink(targetPath, function(err) {
									if (err)  res.status(500).send({message: 'Виникла помилка при видалені файлу'});
								});
							} else {
								res.status(200).send({message: 'Файл успішно збережено', offer: offer});
							};
						});
					};
				});
			};
		});
	} else {
		res.status(404).send({message: 'Не вдалося надіслати файл'});
	};
};

module.exports.deleteOfferFile = function(req, res) {
	var id = req.params.offerId;
	var targetPath = path.join(__dirname, '../../uploads/');

	Offer.findById(id)
	.exec(function(err, offer) {
		if (err) {
				res.status(500).send({message: 'Не вдалося видалити файл'});
			} else {
				targetPath = targetPath + offer.file;
				fs.unlink(targetPath, function(err) {
					if (err) {
						res.status(500).send({message: 'Виникла помилка при видалені файлу'});
					} else {
						offer.file = undefined;
						offer.save(function(err, offer) {
							if (err) {
								res.status(500).send({message: 'Виникла помилка при видалені файлу'});
							} else {
								res.status(200).send({message: 'Файл успішно видалено', offer: offer});
							}
						});
						
					};
				});
			};
	});
};