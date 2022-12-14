const { pagination } = require('../helper/pagination');
const ReviewModel = require('../model/ReviewModel');

class ReviewController {
	async create(req, res) {
		try {
			const { title, content, writer, images, primary_image } = req.body;
			if (!title) {
				return res.status(200).json({
					status_code: 101,
					error_message: req.__('Title must be required')
				});
			}
			if (!content) {
				return res.status(200).json({
					status_code: 101,
					error_message: req.__('Content must be required')
				});
			}

			const new_review = new ReviewModel({
				title,
				content,
				writer,
				images,
				primary_image
			});
			await new_review.save();

			res.status(200).json({
				status: true,
				status_code: 200,
				message: req.__('Create review successfully'),
				data: new_review
			});
		} catch (error) {
			res.status(500).json({
				message: 'Server error',
				error: error.message,
				status_code: 500
			});
		}
	}

	async list(req, res) {
		try {
			let { page, limit, sort, search, filter } = req.body;
			let query = {};
			if (!filter) {
				query = {
					...query,
					is_deleted: false
				};
			}
			if (search) {
				query = {
					...query,
					title: {
						$regex: search,
						$options: 'i'
					}
				};
			}
			if (!sort) {
				sort = {
					created_at: -1
				};
			}

			query = {
				...query,
				...filter
			};
			const count = await ReviewModel.countDocuments(query);
			let currentPage = parseInt(page) || 1;

			let perPage = parseInt(limit) || 10;
			let paginate = pagination(currentPage, perPage, count);

			const result = await ReviewModel.find(query)
				.sort(sort)
				.limit(paginate.per_page)
				.skip((paginate.current_page - 1) * paginate.per_page)
				.lean();
			res.status(200).json({
				status: true,
				status_code: 200,
				message: req.__('Get list review successfully'),
				data: result,
				pagination: { ...paginate, total: count }
			});
		} catch (error) {
			res.status(500).json({
				message: 'Server error',
				error: error.message,
				status_code: 500
			});
		}
	}

	async edit(req, res) {
		try {
			const { review_id, content, images, primary_image, writer } = req.body;
			if (!review_id) {
				return res.status(200).json({
					status_code: 101,
					error_message: req.__('Review id must be required')
				});
			}
			const is_exist = await ReviewModel.findOne({ _id: review_id });
			if (!is_exist) {
				return res.status(200).json({
					status_code: 105,
					error_message: req.__('Review not found')
				});
			}

			if (content && content === '') {
				return res.status(200).json({
					status_code: 101,
					error_message: req.__('Content must be required')
				});
			}

			await ReviewModel.findByIdAndUpdate(
				{
					_id: review_id
				},
				{
					content,
					images,
					primary_image,
					writer
				}
			);
			res.status(200).json({
				status: true,
				status_code: 200,
				message: req.__('Update review successfully')
			});
		} catch (error) {
			res.status(500).json({
				message: 'Server error',
				error: error.message,
				status_code: 500
			});
		}
	}

	async detail(req, res) {
		try {
			const { review_id } = req.body;
			if (!review_id) {
				return res.status(200).json({
					status_code: 101,
					error_message: req.__('Review id must be required')
				});
			}
			const result = await ReviewModel.findOne({ _id: review_id });
			if (!result) {
				return res.status(200).json({
					status_code: 105,
					error_message: req.__('Review not found')
				});
			}
			res.status(200).json({
				status: true,
				status_code: 200,
				message: req.__('Get detail review successfully'),
				data: result
			});
		} catch (error) {
			res.status(500).json({
				message: 'Server error',
				error: error.message,
				status_code: 500
			});
		}
	}

	async remove(req, res) {
		try {
			const { ids } = req.body;
			if (!ids) {
				return res.status(200).json({
					status_code: 101,
					error_message: req.__('Review id must be required')
				});
			}

			for (let i = 0; i < ids.length; i++) {
				const is_exist = await ReviewModel.findOne({ _id: ids[0] });
				if (!is_exist) {
					return res.status(200).json({
						status_code: 105,
						error_message: req.__('Review not found')
					});
				}
			}

			await ReviewModel.updateMany({ _id: { $in: ids } }, { is_deleted: true });
			res.status(200).json({
				status: true,
				status_code: 200,
				message: req.__('Delete review successfully')
			});
		} catch (error) {
			res.status(500).json({
				message: 'Server error',
				error: error.message,
				status_code: 500
			});
		}
	}
}

module.exports = new ReviewController();
