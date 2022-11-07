const mongoose = require('mongoose');

const SupportSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true
		},
		phone: {
			type: String,
			required: true,
			trim: true
		},
		content: {
			type: String,
			required: true,
			trim: true
		},
		is_process: {
			type: String,
			enum: ['in_progress', 'completed', 'pending', 'cancel'],
			default: 'pending'
		}
	},
	{
		timestamps: {
			createdAt: 'created_at',
			updatedAt: 'updated_at'
		}
	}
);

module.exports = mongoose.model('Support', SupportSchema);
