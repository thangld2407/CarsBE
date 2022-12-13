const InsuranceModel = require('../model/InsuranceModel');

class InsuranceController {
	async get(req, res) {
		try {
			const insurance = await InsuranceModel.find().lean();
			if (insurance && insurance.length === 0) {
				const new_insurance = new InsuranceModel({
					file: []
				});
				await new_insurance.save();
				return res.status(200).json({
					message: req.__('GET_INSURANCE_SUCCESS'),
					data: new_insurance,
					status: true,
					status_code: 200
				});
			}
			res.status(200).json({
				message: req.__('GET_INSURANCE_SUCCESS'),
				data: insurance[0],
				status: true,
				status_code: 200
			});
		} catch (error) {
			res.status(500).json({
				message: req.__('SERVER_ERROR'),
				error_code: 500,
				error: error.message
			});
		}
	}

	async update(req, res) {
		try {
			const { file, insurance_id } = req.body;
			if (!file || file.length === 0) {
				return res.status(200).json({
					message: req.__('File is required'),
					status: false,
					status_code: 101
				});
			}
			if (!insurance_id) {
				return res.status(200).json({
					message: req.__('ID is required'),
					status: false,
					status_code: 101
				});
			}

			await InsuranceModel.findByIdAndUpdate(insurance_id, {
				file: file
			});

			res.status(200).json({
				message: req.__('UPDATE_INSURANCE_SUCCESS'),
				status: true,
				status_code: 200
			});
		} catch (error) {
			res.status(500).json({
				message: req.__('SERVER_ERROR'),
				error_code: 500,
				error: error.message
			});
		}
	}
}

module.exports = new InsuranceController();
