const { jwt_conf } = require('../config');
const config = require('../config');
const { comparePassword } = require('../helper/hash');
const TokenModel = require('../model/TokenModel');
const UserModel = require('../model/UserModel');
const { generateAccessToken, generateRefreshToken, verifyToken } = require('../utils/jwt');

class AuthController {
	async login(req, res) {
		try {
			const { email, password } = req.body;
			const user = await UserModel.findOne({ email });
			if (!user) {
				return res.status(200).json({
					message: req.__('User not found'),
					status_code: 105
				});
			}
			const isMatch = comparePassword(password, user.password);
			if (!isMatch) {
				return res.status(200).json({
					message: req.__('Password is incorrect'),
					status_code: 106
				});
			}
			const token = generateAccessToken({ user });
			const refresh_token = generateRefreshToken({ user });

			const newToken = new TokenModel({
				token: refresh_token
			});

			await newToken.save();

			res.status(200).json({
				message: req.__('Logged in successfully'),
				access_token: token,
				access_token_expires_in: `${config.jwt_conf.tokenLife / 60}m`,
				refresh_token
			});
		} catch (error) {
			res.status(500).json({ message: error.message, status_code: 500 });
		}
	}

	async relogin(req, res) {
		try {
			const { refresh_token } = req.body;
			if (!refresh_token) {
				return res.status(200).json({
					message: req.__('Refresh token is required'),
					status_code: 101,
					status: false
				});
			}
			const token = await TokenModel.findOne({ token: refresh_token });
			if (!token) {
				return res.status(200).json({
					message: req.__('Refresh token is invalid'),
					status_code: 106,
					status: false
				});
			}
			const isVerifyToken = verifyToken(refresh_token, jwt_conf.refreshTokenSecret);
			if (!isVerifyToken) {
				return res.status(200).json({
					message: req.__('Refresh token is invalid'),
					status_code: 106,
					status: false
				});
			}

			const newToken = generateAccessToken({ user: isVerifyToken.user });
			const newRefreshToken = generateRefreshToken({ user: isVerifyToken.user });

			const newRefreshTokenSave = new TokenModel({
				token: newRefreshToken
			});
			await TokenModel.findOneAndRemove({ token: token.token });
			await newRefreshTokenSave.save();

			res.status(200).json({
				message: req.__('Relogin in successfully'),
				access_token: newToken,
				access_token_expires_in: `${config.jwt_conf.tokenLife / 60}m`,
				refresh_token: newRefreshToken,
				status: true,
				status_code: 200
			});
		} catch (error) {
			res.status(500).json({
				message: req.__('Server error'),
				error_message: error.message,
				status_code: 500
			});
		}
	}
}

module.exports = new AuthController();
