var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var paymentSchema = Schema({
	date: Date,
	client: {type: Schema.Types.ObjectId, ref: 'Client'},
	sum: String,
	exchange: String,
	payment_type: {type: String, enum: ['готівка', 'безготівка']}
});

module.exports = mongoose.model('Payment', paymentSchema);