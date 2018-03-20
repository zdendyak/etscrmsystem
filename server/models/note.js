var mongoose = require('mongoose'),
	Schema = mongoose.Schema;


var noteSchema = Schema({
	date: {type: Date, default: Date.now},
	client: {type: Schema.Types.ObjectId, ref: 'Client'},
	text: String
});

module.exports = mongoose.model('Note', noteSchema);