const { jwt_conf } = require('../config');
const UserModel = require('../model/UserModel');
const { verifyToken } = require('../utils/jwt');

module.exports = async (req, res, next) => {
	try {
		// let token;
		// if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
		// 	token = req.headers.authorization.split(' ')[1];
		// }

		// if (!token) {
		// 	return res.status(404).json({
		// 		message: req.__('Unauthorization'),
		// 		status_code: 404
		// 	});
		// }

		// let decoded;
		// try {
		// 	decoded = verifyToken(token, jwt_conf.secret);
		// } catch (err) {
		// 	return res.status(500).json({
		// 		message: err.message,
		// 		status_code: 500,
		// 		error_message: req.__('Server error')
		// 	});
		// }
		// const user = await UserModel.findById(decoded.user._id);
		// if (!user) {
		// 	return res.status(404).json({ message: 'Unauthorization', status_code: 404 });
		// }
		next();
	} catch (err) {
		res.status(500).json({ error: err.message, status_code: 500 });
	}
};
