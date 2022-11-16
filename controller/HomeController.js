const HomeModel = require('../model/HomeModel');

class HomeController {
	async create(req, res) {
		try {
			let image = req.body.image;
			if (!image) {
				image = '/assets/images/banner.jpg';
			}

			const hasUnsetBanner = await HomeModel.findOne({ is_banner: true });
			if (hasUnsetBanner) {
				return res.status(200).json({
					message: req.__('Home banner already exists. Please update it'),
					status_code: 102,
					status: false
				});
			}

			const data = new HomeModel({
				image,
				is_banner: true
			});
			await data.save();

			res.status(200).json({
				message: req.__('Create home banner success'),
				status_code: 200,
				status: true
			});
		} catch (error) {
			res.status(500).json({
				error: error.message,
				status_code: 500,
				message: req.__('Server error')
			});
		}
	}

	async update(req, res) {
		let image = req.body.image;
		if (!image) {
			image = '/assets/images/banner.jpg';
		}
		try {
			const data = await HomeModel.findOneAndUpdate({ is_banner: true }, { image });
			if (!data) {
				return res.status(200).json({
					message: req.__('Home banner not found'),
					status_code: 102,
					status: false
				});
			}

			res.status(200).json({
				message: req.__('Update home banner success'),
				status_code: 200,
				status: true
			});
		} catch (e) {
			res.status(500).json({
				error: e.message,
				status_code: 500,
				message: req.__('Server error')
			});
		}
	}
}

module.exports = new HomeController();
