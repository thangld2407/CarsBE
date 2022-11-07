module.exports = async function (req, res, next) {
	try {
		await next();
	} catch (error) {
		res.status(500).json({
			message: error.message,
			error_code: 500
		});
	}
};
