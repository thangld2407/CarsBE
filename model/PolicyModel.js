const mongoose = require('mongoose');

const PolicyModel = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
			unique: true,
			default: ''
		},
		files: {
			type: Array,
			required: true,
			trim: true,
			default: []
		},
		description: {
			type: String,
			trim: true,
			default: ''
		}
	},
	{
		timestamps: {
			createdAt: 'created_at',
			updatedAt: 'updated_at'
		}
	}
);

module.exports = mongoose.model('Policy', PolicyModel);
