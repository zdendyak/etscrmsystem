
var User = require('../models/user');


module.exports.register = function(req, res, next) {
	if (!req.body.username || !req.body.password) {
		res.json({success: false, message: 'Введіть логін і пароль'});
	} else {
		User.findOne({username: req.body.username}, function(err, user) {
			if (err) { return next(err);};

			if (user) {
				return res.json({success: false, message: 'Користувач з таким іменем вже існує'});
			};

			var newUser = new User(req.body);
			newUser.save(function(err, user) {
				if (err) {
					res.json({success: false, message: 'Виникла помилка при збереженні данних'});
				};

				return res.json({success: true, token: 'JWT ' + user.generateJWT()})
			});
		});
	};
};

module.exports.login = function(req, res, next) {
	User.findOne({username: req.body.username}, function(err, user) {
		if (err) { return next(err);};

		if (!user) {
			res.json({success: false, message: 'Користувач з таким іменем не знадений'});
		} else {
			user.comparePassword(req.body.password, function(err, isMatch) {
				if (isMatch && !err) {
					res.status(200).json({success:true, token: 'JWT ' + user.generateJWT()});
				} else {
					res.json({success: false, message: 'Невірний пароль'});
				};
			});
		}
	});
};