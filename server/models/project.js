const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	image: String, //image stored as url or base64
	createdBy: {
		type: String,
		required: true,
	},
});

const project = mongoose.model('project', projectSchema);

module.exports = project;
