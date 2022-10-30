const mongoose = require('mongoose');

const StaffSchema = new mongoose.Schema(
	{
		staff_name: {
			type: String,
			required: true,
			trim: true
		},
		staff_email: {
			type: String,
			required: true,
			trim: true
		},
		staff_description: {
			type: String,
			required: true
		},
		image: {
			type: String,
			trim: true
		},
		sns_zalo: {
			type: String,
			trim: true
		},
		sns_phone: {
			type: String,
			trim: true
		},
		sns_kakaotalk: {
			type: String,
			trim: true
		},
		sns_messenger: {
			type: String,
			trim: true
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

module.exports = mongoose.model('Staff', StaffSchema);
