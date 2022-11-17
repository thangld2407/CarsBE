module.exports = {
	jwt_conf: {
		secret: process.env.JWT_SECRET,
		refreshTokenSecret: process.env.JWT_REFRESH_SECRET,
		tokenLife: 900,
		refreshTokenLife: 86400
	}
};
