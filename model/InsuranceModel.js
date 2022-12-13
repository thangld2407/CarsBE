const mongoose = require('mongoose');

const InsuranceSchema = new mongoose.Schema(
	{
		file: {
			type: Array,
			default: []
		}
	},
	{
		timestamps: {
			createdAt: 'created_at',
			updatedAt: 'updated_at'
		}
	}
);

module.exports = mongoose.model('Insurance', InsuranceSchema);
