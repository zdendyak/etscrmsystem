
var multiparty = require('connect-multiparty');
var express = require('express');

module.exports = function(passport) {
	var router = express.Router();

	//check authentication
	var requireAuth = passport.authenticate('jwt', {session: false});
	router.use(requireAuth);
	//multiparty middleware
	var multipartMiddleware = multiparty();

	var userController = require('../controllers/user-controller');

	router.get('/', userController.getAllUsers);

	router.get('/:id', userController.getUserById);

	router.put('/:id', userController.updateProfile);

	router.put('/:id/updatePhoto', multipartMiddleware, userController.updatePhoto);

	return router;
};
