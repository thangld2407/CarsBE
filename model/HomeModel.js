const mongoose = require('mongoose');

const HomeSchema = new mongoose.Schema(
	{
		image: {
			type: String,
			required: true,
			trim: true
		},
		is_banner: {
			type: Boolean,
			default: false
		}
	},
	{
		timestamps: {
			createdAt: 'created_at',
			updatedAt: 'updated_at'
		}
	}
);

module.exports = mongoose.model('Home', HomeSchema);
