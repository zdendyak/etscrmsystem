var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var config = require('../config/main');

var userSchema = new mongoose.Schema({
	username: {type: String, lowercase: true, unique: true, required: true},
	password: {type: String, required: true},
	firstName: String,
	lastName: String,
	photo: String,
	phone: String,
	phone2: String,
	email: String,
	role: {
		type: String,
		enum: ['Manager', 'Engineer', 'Admin'],
		default: 'Manager'
	}
});

userSchema.pre('save', function(next) {
	var user = this;
	const SALT_FACTOR = 10;

	if (user.isModified('password') || user.isNew) {
		bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
			if (err) { return next(err);};

			bcrypt.hash(user.password, salt, function(err, hash) {
				if (err) {return next(err);};

				user.password = hash;
				next();
			})
		})
	} else {
		return next();
	};
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
		if (err) {return cb(err);};

		cb(null, isMatch);
	});
};

userSchema.methods.generateJWT = function() {
	var today = new Date();
	var exp = new Date(today);
	exp.setDate(today.getDate() + 60);

	return jwt.sign({
		id: this._id,
		username: this.username,
		firstName: this.firstName,
		lastName: this.lastName,
		role: this.role,
		photo: this.photo,
		exp: parseInt(exp.getTime()/1000)
	}, config.secret);
};


module.exports = mongoose.model('User', userSchema);