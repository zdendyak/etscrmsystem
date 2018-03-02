var Invoice = require('../models/invoice');
var fs = require('fs');
var path = require('path')

function isFullAccess(req) {
	if (req.user.role == 'Admin' || req.user.role == 'Engineer') {
		return true;
	} else {
		return false;
	}
};

function isAccess(req, invoice) {
	return isFullAccess(req) || 
	(invoice.manager._id && req.user._id.toString() === invoice.manager._id.toString()) || 
	(invoice.manager && req.user._id.toString() === invoice.manager.toString());
};

module.exports.getAllInvoices = function(req, res) {
	var query;
	if (isFullAccess(req)) {
		query = {};
	} else {
		query = {manager: req.user._id};
	};

	Invoice.find(query)
	.populate('client', 'name')
	.populate('manager', 'firstName lastName')
	.exec(function(err, invoices) {
		if (err) {
			res.status(500).send({message: 'Вибачте, виникла помилка при отриманні данних'});
		} else {
			res.json(invoices);
		};
	});
};

module.exports.getInvoiceById = function(req, res) {
	var id = req.params.invoiceId;

	Invoice.findById(id)
	.populate('client', 'name')
	.populate('manager', 'firstName lastName')
	exec(function(err, invoice) {
		if (err || !invoice) {
			res.status(500).send({message: 'Вибачте, виникла помилка при отриманні данних'});
		} else {
			if (isAccess(req, invoice)){
				res.status(200).json(invoice);
			} else {
				res.status(403).send({message: 'У Вас недостатньо прав для отримання данних'});
			}
		}
	});
};

module.exports.addInvoice = function(req, res) {
	if (req.body) {
		var invoice = new Invoice(req.body);
		invoice.manager = req.user._id;

		invoice.save(function(err, invoice) {
			if (err) {
				res.status(500).send({message: 'Вибачте, виникла помилка при збереженні данних'});
			} else {
				res.send({message: 'Дані збережено', invoice: invoice});
			};
		});
	} else {
		res.send({message: 'Ви не надали необхідних данних'});
	}
};

module.exports.updateInvoice = function(req, res) {
	var id = req.params.invoiceId;

	Invoice.findById(id)
	.exec(function(err, invoice) {
		if (err || !invoice) {
			res.status(500).send({message: 'Вибачте, виникла помилка при збереженні данних'});
		} else {
			if (isAccess(req, invoice) && req.body) {
				Object.assign(invoice, req.body);
				invoice.save(function(err, invoice) {
					if (err) {
						res.status(500).send({message: 'Вибачте, виникла помилка при збереженні данних'});
					} else {
						res.send({message: 'Дані збережено', invoice: invoice});
					};
				});
			} else {
				res.status(403).send({message: 'У Вас недостатньо прав, щоб оновити дані'});
			}
		}
	});
};

module.exports.deleteInvoice = function(req, res) {
	var id = req.params.invoiceId;
	Invoice.findById(id)
	.exec(function(err, invoice) {
		if (err) {
			res.status(500).send({message: 'Вибачте, виникла помилка'});
		} else {
			if (invoice && isAccess(req, invoice)) {
				invoice.remove(function(err) {
					if (err) {
						res.status(500).send({message: 'Вибачте, виникла помилка при видалені даних'});
					} else{
						res.status(200).send({message: 'Дані видалені'});
					}
				});
			} else {
				res.status(403).send({message: 'У Вас недостатньо прав, щоб видалити дані'});
			};
		}
	});
};

module.exports.addInvoiceFile = function(req, res) {
	if (req.files.file) {
		var file = req.files.file;
		var id = req.params.invoiceId;

		var uploadDate = new Date().getTime().toString();
		var tempPath = file.path;
		var targetPath = path.join(__dirname, '../../uploads/invoices/' + uploadDate + '__' + file.name);
		var savePath = '/invoices/' + uploadDate + '__' + file.name ;

		fs.rename(tempPath, targetPath, function(err) {
			if (err) { 
				res.status(500).send({message: 'Не вдалося зберегти файл'});
			} else {
				Invoice.findById(id)
				.exec(function(err, invoice) {
					if (err || !invoice) {
						//delete file
						fs.unlink(targetPath, function(err) {
							if (err) res.status(500).send({message: 'Виникла помилка при видалені файлу'});
						});
						res.status(500).send({message: 'Не вдалося зберегти файл'});					
					} else {
						invoice.file = savePath;
						invoice.save(function(err, invoice) {
							if (err) {
								res.status(500).send({message: 'Не вдалося зберегти файл'});
								// delete file
								fs.unlink(targetPath, function(err) {
									if (err)  res.status(500).send({message: 'Виникла помилка при видалені файлу'});
								});
							} else {
								res.status(200).send({message: 'Файл успішно збережено!', invoice: invoice});
							}
						});
					}
				});
			}
		});
	} else {
		res.status(404).send({message: 'Не вдалося надіслати файл'});
	};
};

module.exports.deleteInvoiceFile = function(req, res) {
	var id = req.params.invoiceId;
	var targetPath = path.join(__dirname, '../../uploads/');

	Invoice.findById(id)
	.exec(function(err, invoice) {
		if (err || !invoice) {
				res.status(500).send({message: 'Не вдалося видалити файл'});
			} else {
				targetPath = targetPath + invoice.file;
				fs.unlink(targetPath, function(err) {
					if (err) {
						res.status(500).send({message: 'Виникла помилка при видалені файлу'});
					} else {
						invoice.file = undefined;
						invoice.save(function(err, invoice) {
							if (err) {
								res.status(500).send({message: 'Виникла помилка при видалені файлу'});
							} else {
								res.status(200).send({message: 'Файл успішно видалено', invoice: invoice});
							}
						});
					}
				});
			}
	});
};