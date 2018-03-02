var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var invoiceSchema = Schema({
	number: String,
	date: Date,
	client: {type: Schema.Types.ObjectId, ref: 'Client'},
	sum: String,
	file: String,
	status: String,
	manager: {type: Schema.Types.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Invoice', invoiceSchema);