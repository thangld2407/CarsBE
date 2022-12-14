const mongoose = require('mongoose');

const SaleSchema = new mongoose.Schema(
	{
		is_sale: {
			type: Boolean,
			default: false
		},
		sale_price: {
			type: Number,
			default: 0
		}
	},
	{
		timestamps: {
			createdAt: 'created_at',
			updatedAt: 'updated_at'
		}
	}
);

module.exports = mongoose.model('Sale', SaleSchema);
