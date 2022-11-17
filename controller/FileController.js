const fs = require('fs');

const path = require('path');

class FileController {
	async reqDeleteFile(req, res, next) {
		try {
			const { filename } = req.body;
			if (!filename) {
				return res.status(400).json({
					message: req.__('File name is required'),
					status_code: 400,
					status: false
				});
			}
			const file = path.join(__dirname, '../public/uploads', filename);

			if (!fs.existsSync(file)) {
				return res.status(400).json({
					message: req.__('File not found'),
					status_code: 400,
					status: false
				});
			}

			fs.unlink(file, err => {
				if (err) {
					throw new Error('File not found');
				}
				res.status(200).json({
					message: req.__('Delete file success'),
					status_code: 200,
					status: true
				});
			});
		} catch (error) {
			res.status(500).json({
				error: error.message,
				status_code: 500,
				message: req.__('Server error')
			});
		}
	}
}

module.exports = new FileController();
