const CategoryModel = require('../model/Category');

class CarTypeController {
	async saveCategory(req, res) {
		try {
			const { category_name } = req.body;
			const is_exist = await CategoryModel.findOne({ category_name: category_name.trim() });
			if (is_exist) {
				return res.status(200).json({
					status_code: 102,
					error_message: req.__('Car type already exists')
				});
			}
			if (category_name) {
				const carType = new CategoryModel({
					category_name
				});
				await carType.save();
				res.status(200).json({
					status: true,
					status_code: 200,
					message: 'Save car type success'
				});
			} else {
				res.status(200).json({
					status: false,
					status_code: 104,
					message: 'Save car type fail'
				});
			}
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	}

	async getListCategory(req, res) {
		try {
			const list_category = await CategoryModel.find();
			res.status(200).json({
				message: 'Get list category success',
				status: true,
				status_code: 200,
				data: list_category
			});
		} catch (error) {
			res.status(500).json({ message: error.message, status_code: 500 });
		}
	}
}

module.exports = new CarTypeController();
