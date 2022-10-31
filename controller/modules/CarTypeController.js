const CarTypeModel = require('../../model/CarTypeModel');

class CarTypeController {
	async saveCarTypeCrawl(req, res) {
		try {
			const { car_type_name } = req.body;
			const is_exist = await CarTypeModel.findOne({ car_type_name: car_type_name.trim() });
			if (is_exist) {
				return res.status(200).json({
					error_code: 102,
					error_message: req.__('Car type already exists')
				});
			}
			if (car_type_name) {
				const carType = new CarTypeModel({
					car_type_name
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
}

module.exports = new CarTypeController();
