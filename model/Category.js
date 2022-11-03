const mongoose = require('mongoose');

const CategoryModel = new mongoose.Schema(
	{
		category_name: {
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

module.exports = mongoose.model('Category', CategoryModel);
