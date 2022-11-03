const config = require('../config');
const { comparePassword } = require('../helper/hash');
const UserModel = require('../model/UserModel');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt');

class AuthController {
	async login(req, res) {
		try {
			const { email, password } = req.body;
			const user = await UserModel.findOne({ email });
			if (!user) {
				return res.status(200).json({
					message: req.__('User not found'),
					error_code: 105
				});
			}
			const isMatch = comparePassword(password, user.password);
			if (!isMatch) {
				return res.status(200).json({
					message: req.__('Password is incorrect'),
					error_code: 106
				});
			}
			const token = generateAccessToken({ user });
			const refresh_token = generateRefreshToken({ user });
			return res.status(200).json({
				message: req.__('Logged in successfully'),
				access_token: token,
				access_token_expires_in: `${config.jwt_conf.tokenLife / 60}m`,
				refresh_token
			});
		} catch (error) {
			res.status(500).json({ message: error.message, error_code: 500 });
		}
	}
}

module.exports = new AuthController();
