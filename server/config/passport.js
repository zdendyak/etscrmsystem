var User = require('../models/user');
var config = require('./main');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;

const jwtOpts = {
	jwtFromRequest: ExtractJwt.fromAuthHeader(),
	secretOrKey: config.secret
};

var jwtLogin = new JwtStrategy(jwtOpts, function(payload, done) {
	User.findById(payload.id, function(err, user) {
		if (err) return done(err);

		if (user) {
			done(null, user);
		} else {
			done(null, false);
		}
	});
});

module.exports = function(passport) {
	passport.use(jwtLogin);
};