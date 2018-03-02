var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var clientSchema = Schema({
	name: String,
	adress: String,
	city: String,
	region: String,
	phone: String,
	fax: String,
	email: String,
	manager: {type: Schema.Types.ObjectId, ref: 'User'},
	contacts: [{type: Schema.Types.ObjectId, ref: 'Contact'}],
	notes: [{type: Schema.Types.ObjectId, ref: 'Note'}],
	date: {type: Date, default: Date.now}
});

clientSchema.methods.addContact = function(contact, cb) {
	this.contacts.push(contact);
	this.save(cb);
};

clientSchema.methods.deleteContact = function(contactId, cb) {
	var index = this.contacts.indexOf(contactId);
	if (index !== -1) {
		this.contacts.splice(index, 1);
	};
	this.save(cb);
};

clientSchema.methods.addNote = function(noteId, cb) {
	this.notes.push(noteId);
	this.save(cb);
};

clientSchema.methods.deleteNote = function(noteId, cb) {
	var index = this.notes.indexOf(noteId);
	if (index !== -1) {
		this.notes.splice(index, 1);
	};
	this.save(cb);
};

module.exports = mongoose.model('Client', clientSchema);