const { pagination } = require('../../helper/pagination');
const StaffModel = require('../../model/StaffModel');

class StaffController {
	async create(req, res) {
		const {
			staff_name,
			staff_email,
			staff_description,
			image,
			sns_zalo,
			sns_phone,
			sns_kakaotalk,
			sns_messenger
		} = req.body;
		try {
			if (!staff_name) {
				return res.status(200).json({
					error_code: 101,
					error_message: req.__('Staff name must be required')
				});
			}

			if (!staff_email) {
				return res.status(200).json({
					error_code: 101,
					error_message: req.__('Staff email must be required')
				});
			}

			if (!staff_description) {
				return res.status(200).json({
					error_code: 101,
					error_message: req.__('Staff description must be required')
				});
			}

			const is_exist = await StaffModel.findOne({ staff_email });
			if (is_exist) {
				return res.status(200).json({
					error_code: 102,
					error_message: req.__('Staff already exists')
				});
			}

			const new_staff = new StaffModel({
				staff_name,
				staff_email,
				staff_description,
				image,
				sns_zalo,
				sns_phone,
				sns_kakaotalk,
				sns_messenger
			});

			await new_staff.save();

			res.status(200).json({
				status: true,
				status_code: 200,
				message: req.__('Create staff successfully')
			});
		} catch (err) {
			return res.status(500).json({ error: err.message });
		}
	}
	async detail(req, res) {
		try {
			const { id } = req.params;
			if (!id) {
				return res.status(200).json({
					error_code: 101,
					error_message: req.__('Staff id must be required')
				});
			}
			const staff = await StaffModel.findOne({ _id: id }).lean();

			if (!staff) {
				return res.status(200).json({
					error_code: 105,
					error_message: req.__('Staff not found')
				});
			}

			res.status(200).json({
				status: true,
				status_code: 200,
				message: req.__('Get staff detail successfully'),
				data: staff
			});
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}
	async edit(req, res) {
		try {
			const {
				staff_name,
				staff_email,
				staff_description,
				image,
				sns_zalo,
				sns_phone,
				sns_kakaotalk,
				sns_messenger,
				is_deleted,
				id
			} = req.body;

			if (!id) {
				return res.status(200).json({
					error_code: 101,
					error_message: req.__('Staff id must be required')
				});
			}

			const staff = await StaffModel.findOne({ _id: id });

			if (!staff) {
				return res.status(200).json({
					error_code: 105,
					error_message: req.__('Staff not found')
				});
			}

			const is_exist_email = await StaffModel.findOne({
				staff_email
			});

			if (is_exist_email && is_exist_email._id != id) {
				return res.status(200).json({
					error_code: 102,
					error_message: req.__('Staff email already exists')
				});
			}

			await StaffModel.updateOne(
				{ _id: id },
				{
					staff_name,
					staff_email,
					staff_description,
					image,
					sns_zalo,
					sns_phone,
					sns_kakaotalk,
					sns_messenger,
					is_deleted
				}
			);

			res.status(200).json({
				status: true,
				status_code: 200,
				message: req.__('Update staff successfully')
			});
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	async remove(req, res) {
		try {
			const { id } = req.body;
			if (!id) {
				return res.status(200).json({
					error_code: 101,
					error_message: req.__('Staff id must be required')
				});
			}

			const staff = await StaffModel.findOne({ _id: id });
			if (!staff) {
				return res.status(200).json({
					error_code: 105,
					error_message: req.__('Staff not found')
				});
			}

			await StaffModel.updateOne({ _id: id }, { is_deleted: true });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	async list(req, res) {
		try {
			const {
				page = 1,
				limit = 10,
				search = '',
				is_deleted = false,
				order_name,
				order_created
			} = req.query;

			const count = await StaffModel.countDocuments({});

			let currentPage = parseInt(page) || 1;

			let perPage = parseInt(limit) || 10;
			let paginate = pagination(currentPage, perPage, count);
			const staffs = await StaffModel.find({
				is_deleted: is_deleted,
				$or: [{ staff_name: { $regex: search, $options: 'i' } }],
				$or: [{ staff_email: { $regex: search, $options: 'i' } }],
				$and: [{ is_deleted: is_deleted }]
			})
				.sort({
					staff_name: order_name === 'asc' ? 1 : -1,
					created_at: order_created === 'asc' ? 1 : -1
				})
				.select('-is_deleted')
				.limit(paginate.per_page)
				.skip((paginate.current_page - 1) * paginate.per_page);

			res.status(200).json({
				status: true,
				status_code: 200,
				message: req.__('Get staff list successfully'),
				data: staffs,
				pagination: { ...paginate, total: count }
			});
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}
}

module.exports = new StaffController();
