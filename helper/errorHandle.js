module.exports = async function (req, res, next) {
	try {
		await next();
	} catch (error) {
		res.status(500).json({
			message: error.message,
			status_code: 500
		});
	}
};
