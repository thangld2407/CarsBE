const { pagination } = require('../helper/pagination');
const PolicyModel = require('../model/PolicyModel');
class PolicyController {
	async get(req, res) {
		try {
			let { page, limit, sort, search, filter } = req.body;

			let query = {};

			if (search) {
				query = {
					...query,
					title: {
						$regex: search,
						$options: 'i'
					}
				};
			}

			const count = await PolicyModel.countDocuments(query);
			let currentPage = parseInt(page) || 1;

			let perPage = parseInt(limit) || 10;
			let paginate = pagination(currentPage, perPage, count);

			const result = await PolicyModel.find(query)
				.sort(sort)
				.limit(paginate.per_page)
				.skip((paginate.current_page - 1) * paginate.per_page)
				.lean();

			res.status(200).json({
				status: true,
				status_code: 200,
				message: req.__('Get list policy successfully'),
				data: result,
				pagination: { ...paginate, total: count }
			});
		} catch (error) {
			res.status(500).json({
				message: req.__('Server error'),
				error_code: 500,
				error: error.message
			});
		}
	}

	async create(req, res) {
		try {
			const { title, files, description } = req.body;
			if (!title) {
				return res.status(200).json({
					status: false,
					status_code: 101,
					message: req.__('Title is required')
				});
			}
			if (!files || files.length === 0) {
				return res.status(200).json({
					status: false,
					status_code: 101,
					message: req.__('File is required')
				});
			}

			const hasPolicy = await PolicyModel.findOne({
				title: title
			}).lean();

			if (hasPolicy) {
				return res.status(200).json({
					status: false,
					status_code: 102,
					message: req.__('Policy already exists')
				});
			}

			const new_policy = await PolicyModel.create({
				title,
				files,
				description
			});
			res.status(200).json({
				status: true,
				status_code: 200,
				message: req.__('Create policy successfully'),
				data: new_policy
			});
		} catch (error) {
			res.status(500).json({
				message: req.__('Server error'),
				error_code: 500,
				error: error.message
			});
		}
	}

	async update(req, res) {
		try {
			const { title, files, description, policy_id } = req.body;

			if (!policy_id) {
				return res.status(200).json({
					status: false,
					status_code: 101,
					message: req.__('Policy id is required')
				});
			}

			if (!title) {
				return res.status(200).json({
					status: false,
					status_code: 101,
					message: req.__('Title is required')
				});
			}
			if (!files || files.length === 0) {
				return res.status(200).json({
					status: false,
					status_code: 101,
					message: req.__('File is required')
				});
			}

			const hasPolicy = await PolicyModel.findById(policy_id).lean();

			if (!hasPolicy) {
				return res.status(200).json({
					status: false,
					status_code: 102,
					message: req.__('Policy not found')
				});
			}
			await PolicyModel.updateOne(
				{
					_id: policy_id
				},
				{
					title,
					files,
					description
				}
			);
			res.status(200).json({
				status: true,
				status_code: 200,
				message: req.__('Update policy successfully')
			});
		} catch (error) {
			res.status(500).json({
				message: req.__('Server error'),
				error_code: 500,
				error: error.message
			});
		}
	}

	async delete(req, res) {
		try {
			const { policy_id } = req.body;

			if (!policy_id) {
				return res.status(200).json({
					status: false,
					status_code: 101,
					message: req.__('Policy id is required')
				});
			}

			const hasPolicy = await PolicyModel.findById(policy_id).lean();

			if (!hasPolicy) {
				return res.status(200).json({
					status: false,
					status_code: 102,
					message: req.__('Policy not found')
				});
			}

			await PolicyModel.deleteOne({
				_id: policy_id
			});
			res.status(200).json({
				status: true,
				status_code: 200,
				message: req.__('Delete policy successfully')
			});
		} catch (error) {
			res.status(500).json({
				message: req.__('Server error'),
				error_code: 500,
				error: error.message
			});
		}
	}

	async getDetail(req, res) {
		try {
			const { policy_id } = req.body;

			if (!policy_id) {
				return res.status(200).json({
					status: false,
					status_code: 101,
					message: req.__('Policy id is required')
				});
			}

			const hasPolicy = await PolicyModel.findById(policy_id).lean();

			if (!hasPolicy) {
				return res.status(200).json({
					status: false,
					status_code: 102,
					message: req.__('Policy not found')
				});
			}

			res.status(200).json({
				status: true,
				status_code: 200,
				message: req.__('Get detail policy successfully'),
				data: hasPolicy
			});
		} catch (error) {
			res.status(500).json({
				message: req.__('Server error'),
				error_code: 500,
				error: error.message
			});
		}
	}
}

module.exports = new PolicyController();
