module.exports = {
	async uploadImage(req, res) {
		try {
			if (!req.file) {
				return res.status(400).json({
					error_code: 101,
					error_message: req.__('File is required')
				});
			}

			if (!req.file.mimetype.includes('image')) {
				return res.status(200).json({
					status: false,
					error_code: 100,
					error_message: req.__('Invalid type file')
				});
			}

			res.status(200).json({
				status: true,
				status_code: 200,
				message: req.__('Upload image successfully'),
				data: {
					image: `${process.env.APP_URL}/image/${req.file.filename}`
				}
			});
		} catch (err) {
			return res.status(400).json({ error: err.message });
		}
	}
};
