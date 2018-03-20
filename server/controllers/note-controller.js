var Note = require('../models/note');
var Client = require('../models/client');

module.exports.getAllNotes = function(req, res) {
	Note.find({}, function(err, notes) {
		if (err) {
			res.status(500).send({message: 'Вибачте, виникла помилка при отриманні данних'});
		} else {
			res.json(notes);
		};
	});
};

module.exports.getAllNoteOfClient = function(req, res) {
	var clientId = req.params.clientId;
	Note.find({client: clientId}, function(err, notes) {
		if (err) {
			res.status(500).send({message: 'Вибачте, виникла помилка при отриманні данних'});
		} else {
			res.json(notes);
		};
	});
};

module.exports.addNote = function(req, res) {
	var note = new Note(req.body);

	note.save(function(err, note) {
		if (err) {
			res.status(500).send({message: 'Вибачте, виникла помилка при збережені данних'});
		} else {
			Client.findOne({_id: note.client}, function(err, client) {
				if (err) {
					res.status(500).send({message: 'Вибачте, виникла помилка при збережені данних'});
				} else {
					client.notes.push(note);
					client.save(function(err) {
						if (err) {
							res.status(500).send({message: 'Вибачте, виникла помилка при збережені данних'});
						} else {
							res.json(note);
						};
					});
				};
			});
		};
	});
};

module.exports.deleteNote = function(req, res) {
	var noteId = req.params.noteId;
	Note.findById(noteId, function(err, note) {
		if (err) {
			res.status(500).send({message: 'Вибачте, виникла помилка при видаленні данних'});
		} else {
			var clientId = note.client;
			Client.findById(clientId)
			.exec(function(err, client) {
				if (err) {
					res.status(500).send({message: 'Вибачте, виникла помилка при видаленні данних'});
				} else {
					client.deleteNote(noteId, function(err, client) {
						if (err) {
							res.status(500).send({message: 'Вибачте, виникла помилка при видаленні данних'});
						} else {
							note.remove(function(err) {
								if (err) {
									res.status(500).send({message: 'Вибачте, виникла помилка при видаленні данних'});
								} else {
									res.status(200).send({message: 'Дані видалені'});
								};
							});
						};
					});
				};
			});
		};
	});
};