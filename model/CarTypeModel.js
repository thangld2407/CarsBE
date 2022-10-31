const mongoose = require('mongoose');

const CarTypeSchema = new mongoose.Schema(
	{
		car_type_name: {
			type: String,

			required: true
		}
	},
	{
		timestamps: {
			createdAt: 'created_at',
			updatedAt: 'updated_at'
		}
	}
);

module.exports = mongoose.model('CarType', CarTypeSchema);
