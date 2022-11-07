const jwt = require('jsonwebtoken');

const jwt_conf = require('../config').jwt_conf;

const generateAccessToken = payload => {
	return jwt.sign(payload, jwt_conf.secret, { expiresIn: jwt_conf.tokenLife });
};

const generateRefreshToken = payload => {
	return jwt.sign(payload, jwt_conf.refreshTokenSecret, {
		expiresIn: jwt_conf.refreshTokenLife
	});
};

const verifyToken = (token, secret) => {
	return jwt.verify(token, secret);
};

module.exports = { generateAccessToken, generateRefreshToken, verifyToken };
