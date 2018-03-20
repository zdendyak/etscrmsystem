var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var contactSchema = Schema({
	name: String,
	position: String,
	phone: String,
	phone2: String,
	email: String,
	manager: {type: Schema.Types.ObjectId, ref: 'User'},
	client: {type: Schema.Types.ObjectId, ref: 'Client'}
});

module.exports = mongoose.model('Contact', contactSchema);