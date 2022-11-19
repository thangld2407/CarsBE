const mongoose = require('mongoose');

const PolicyModel = new mongoose.Schema(
	{
		file: {
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
