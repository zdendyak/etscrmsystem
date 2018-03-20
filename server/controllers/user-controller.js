var path = require('path');
var fs = require('fs');

var User = require('../models/user');

module.exports.getUserById = function(req, res) {
	var id = req.params.id;

	User.findById(id, function(err, user) {
		if (err) {
			res.status(500).send({message: "Вибачте, виникла помилка"});
		} else {
			res.status(200).json({
				id: user._id,
				username: user.username,
				firstName: user.firstName,
				lastName: user.lastName,
				phone: user.phone,
				phone2: user.phone2,
				email: user.email,
				role: user.role,
				photo: user.photo
			});
		};
	});
};

module.exports.getAllUsers = function(req, res) {

	User.find({}, function (err, users) {
		if (err) {
			res.status(500).send({message: 'Вибачте, виникла помилка.'});
		} else {
			var data = [];
			users.forEach(function(user) {
				var userData = {
					id: user._id,
					username: user.username,
					firstName: user.firstName,
					lastName: user.lastName,
					phone: user.phone,
					phone2: user.phone2,
					email: user.email,
					role: user.role,
					photo: user.photo
				};
				data.push(userData);
			})
			res.status(200).json(data);
		}
	});
};

module.exports.updateProfile = function(req, res) {
	var id = req.user._id;
	User.findOne({_id: id}, function (err, user) {
		if (err) {
			res.status(500).send({message: 'Вибачте, виникла помилка.'});
		} else {
			user.firstName = req.body.firstName;
			user.lastName = req.body.lastName;
			user.phone = req.body.phone;
			user.phone2 = req.body.phone2;
			user.email = req.body.email;
			
			user.save(function(err, user) {
				if (err) {
					res.status(500).send({message: 'Вибачте, виникла помилка.'});
				} else {
					res.status(200).send({
						message: "Дані оновлено", 
						user: {
							id: user._id,
							username: user.username,
							firstName: user.firstName,
							lastName: user.lastName,
							phone: user.phone,
							phone2: user.phone2,
							email: user.email,
							role: user.role,
							photo: user.photo
						}
					});
				};
			});
		};
	});
};

module.exports.updatePhoto = function(req, res) {

	if (req.files.file) {
		var file = req.files.file;
		var userId = req.user._id;
		
		var uploadDate = new Date().getTime().toString();
		var tempPath = file.path;
		var targetPath = path.join(__dirname, '../../public/image/' + userId + uploadDate + file.name);
		var savePath = '/image/' + userId + uploadDate + file.name;


		fs.rename(tempPath, targetPath, function(err) {
			if (err) { 
				res.status(500).send({message: 'Не вдалося оновити фото. Виникла помилка при завантаженні фото'});
			} else {
				User.findOne({_id: userId}, function (err, user) {
					if (err) {
						res.status(500).send({message: 'Вибачте, виникла помилка при пошуку користувача'});
					} else {
							//save new path
							user.photo = savePath;
							user.save(function(err, user) {
								if (err) {
									res.status(500).send({message: 'Вибачте, виникла помилка при збереженні данних.'});
								} else {
									res.status(200).send({
										message: "Дані оновлено", 
										user: {
											id: user._id,
											username: user.username,
											firstName: user.firstName,
											lastName: user.lastName,
											phone: user.phone,
											phone2: user.phone2,
											email: user.email,
											role: user.role,
											photo: user.photo
										}
									});
								};
							});
					};
				});

			}
		});

		
		
	};	
};
