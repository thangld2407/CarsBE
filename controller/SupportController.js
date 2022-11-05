const SupportModel = require('../model/SupportModel');
const UserModel = require('../model/UserModel');
const sendEmail = require('../utils/mailer');

class SupportController {
	async create(req, res) {
		const { name, phone, content } = req.body;
		if (!name) {
			return res.status(200).json({
				error_code: 101,
				error_message: req.__('Name must be required'),
				status: false
			});
		}

		if (!phone) {
			return res.status(200).json({
				error_code: 101,
				error_message: req.__('Phone must be required'),
				status: false
			});
		}

		if (!content) {
			return res.status(200).json({
				error_code: 101,
				error_message: req.__('Content must be required'),
				status: false
			});
		}

		try {
			const new_opinion = new SupportModel({
				name,
				phone,
				content
			});
			await new_opinion.save();
			await sendEmail({
				email: 'kimvu1220@gmail.com',
				subject: 'Test',
				html: 'Test'
			});
			res.status(200).json({
				status: true,
				status_code: 200,
				message: req.__('Create support successfully')
			});
		} catch (error) {
			res.status(500).json({
				message: req.__('Server error'),
				error_code: 500,
				error_message: error.message
			});
		}
	}
}

module.exports = new SupportController();
