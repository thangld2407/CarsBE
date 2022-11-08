const { STATUS_PROCESS } = require('../constants/enum');
const template = require('../helper/emailTemplate');
const { pagination } = require('../helper/pagination');
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
				email: process.env.ADMIN_EMAIL || 'thangld2407@gmail.com',
				subject: 'Bạn có một yêu cầu hỗ trợ mới',
				html: template(name, content)
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

	async get(req, res) {
		try {
			let { page = 1, limit = 10, search = '', sort, filter } = req.body;
			let query = {};
			if (!sort) {
				sort = { created_at: -1 };
			}

			if (search) {
				query = {
					...query,
					name: { $regex: search, $options: 'i' }
				};
			}
			query = {
				...query,
				...filter
			};
			const count = await SupportModel.countDocuments(query);

			let currentPage = parseInt(page) || 1;
			let perPage = parseInt(limit) || 10;
			let paginate = pagination(currentPage, perPage, count);

			const supports = await SupportModel.find(query)
				.sort(sort)
				.limit(paginate.per_page)
				.skip((paginate.current_page - 1) * paginate.per_page);

			res.status(200).json({
				status: true,
				status_code: 200,
				message: req.__('Get supports successfully'),
				data: supports,
				pagination: { ...paginate, total: count }
			});
		} catch (error) {
			res.status(500).json({
				message: req.__('Server error'),
				error_code: 500,
				error_message: error.message
			});
		}
	}

	async detail(req, res) {
		try {
			const { support_id } = req.body;
			if (!support_id) {
				return res.status(200).json({
					error_code: 101,
					error_message: req.__('Support id must be required'),
					status: false
				});
			}
			const has_support = await SupportModel.findById(support_id);
			if (!has_support) {
				return res.status(200).json({
					error_code: 105,
					error_message: req.__('Support not found'),
					status: false
				});
			}

			res.status(200).json({
				status: true,
				status_code: 200,
				message: req.__('Get support successfully'),
				data: has_support
			});
		} catch (error) {
			res.status(500).json({
				message: req.__('Server error'),
				error_code: 500,
				error_message: error.message
			});
		}
	}

	async edit(req, res) {
		try {
			const { support_id, is_process } = req.body;
			if (!support_id) {
				return res.status(200).json({
					error_code: 101,
					error_message: req.__('Support id must be required'),
					status: false
				});
			}

			const has_support = await SupportModel.findById(support_id);
			if (!has_support) {
				return res.status(200).json({
					error_code: 105,
					error_message: req.__('Support not found'),
					status: false
				});
			}

			if (!is_process || !STATUS_PROCESS.includes(is_process)) {
				return res.status(200).json({
					error_code: 100,
					error_message: req.__('Invalid status process'),
					status: false
				});
			}
			await SupportModel.findByIdAndUpdate(support_id, {
				is_process
			});
			res.status(200).json({
				status: true,
				status_code: 200,
				message: req.__('Edit support successfully')
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
