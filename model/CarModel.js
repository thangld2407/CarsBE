const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema(
	{
		// Thông tin cơ bản
		car_name: {
			type: String,
			trim: true
		},
		price: {
			type: String,
			trim: true
		},
		car_code: {
			type: String,
			trim: true
		},
		license_plate: {
			type: String,
			trim: true
		},
		year_manufacture: {
			type: String,
			trim: true
		},
		distance_driven: {
			type: String,
			trim: true
		},
		fuel_type: {
			type: String,
			trim: true
		},
		gearbox: {
			type: String,
			trim: true
		},
		cylinder_capacity: {
			type: String,
			trim: true
		},
		color: {
			type: String,
			trim: true
		},
		car_type: {
			type: String,
			trim: true
		},
		seizure: {
			type: String,
			trim: true
		},
		mortgage: {
			type: String,
			trim: true
		},
		presentation_number: {
			type: String,
			trim: true
		},
		storage_location: {
			type: String,
			trim: true
		},
		primary_image: {
			type: String,
			trim: true,
			default: `${process.env.APP_URL}/assets/images/noimage.png`
		},
		is_hotsale: {
			type: Boolean,
			default: false
		},
		images: {
			type: Array,
			default: []
		},
		category: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Category'
		},
		// Detail Vehicle

		exterior: {
			type: Array,
			default: []
		},
		guts: {
			type: Array,
			default: []
		},
		safety: {
			type: Array,
			default: []
		},
		convenience: {
			type: Array,
			default: []
		},

		// Seller

		phone_contact: {
			type: String,
			trim: true
		},
		seller_name: {
			type: String,
			trim: true
		},
		employee_number: {
			type: String,
			trim: true
		},
		affiliated_company: {
			type: String,
			trim: true
		},
		business_address: {
			type: String,
			trim: true
		},
		parking_location: {
			type: String,
			trim: true
		},

		performance_check: {
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

module.exports = mongoose.model('Car', CarSchema);
