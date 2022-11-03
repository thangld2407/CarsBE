const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
	{
		primary_image: {
			type: String,
			trim: true,
			default: `${process.env.APP_URL}/assets/images/noimage.png`
		},
		images: {
			type: Array,
			default: []
		},
		title: {
			type: String,
			trim: true
		},
		content: {
			type: String,
			trim: true
		},
		writer: {
			type: String,
			trim: true,
			default: 'Anonymous'
		},
		is_deleted: {
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

module.exports = mongoose.model('Review', reviewSchema);
